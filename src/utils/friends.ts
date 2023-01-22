import { whenever } from '@vueuse/shared';
import type { DataConnection } from 'peerjs';
import { peer } from 'src/utils/peer';
import { decrypt, generateRiddle } from 'src/utils/security';
import { sleep } from 'src/utils/sleep';
import { username as myUsername } from 'src/utils/username';
import { Unreliable } from 'src/utils/utility-types';
import type { Writable } from 'type-fest';
import { markRaw, reactive, Ref, ref, watch } from 'vue';

type ContactStatus =
  | 'incoming friend request'
  | 'outgoing friend request'
  | 'friend'
  | 'ignore';

type VerificationStatus = 'pending' | 'verified' | 'untrusted';

type CallerMetadata = {
  username: string;
  callerAuthenticationRiddle: number[];
};

type CalleeHandshakeData = {
  message: 'Hello my friend';
  username: string;
  calleeAuthenticationAnswer: number[];
  calleeAuthenticationRiddle: number[];
};

type CallerHandshakeData = {
  callerAuthenticationAnswer: number[];
};

export interface Contact {
  readonly id: string;
  readonly username: string;
  readonly status: ContactStatus;
  readonly connected: boolean;
  readonly verification: VerificationStatus;
  readonly connection?: DataConnection;
  highlight: boolean;
  remove(): void;
  acceptFriendRequest(): Promise<void>;
}

type WritableContact = Writable<Contact>;

export async function newContact(
  id: string,
  status: ContactStatus,
  username?: string,
): Promise<Contact> {
  const self: WritableContact = reactive({
    id: id,
    status: status,
    username: username ?? `${id.slice(0, 5)}..${id.slice(-5)}`,
    connected: false,
    highlight: false,
    verification: 'pending',
    connection: undefined,
    remove,
    acceptFriendRequest,
  });

  whenever(
    () => self.connection,
    (connection) => {
      connection.on('open', () => {
        self.connected = true;
      });

      connection.on('close', () => {
        self.connected = false;
      });

      connection.on('iceStateChanged', (state) => {
        if (state === 'disconnected') self.connected = false;
      });

      connection.on('data', (_data) => {
        if (self.verification !== 'verified') return;
        const data = _data as Unreliable<CalleeHandshakeData>;
        if (data?.message === 'Hello my friend') self.status = 'friend';
        if (data?.username) self.username = data?.username;
      });
    },
  );

  if (status === 'friend' || status === 'outgoing friend request')
    self.connection = await connect();

  async function connect(): Promise<DataConnection> {
    const { riddle, solution } = await generateRiddle(id);

    const metadata: CallerMetadata = {
      username: myUsername.value,
      callerAuthenticationRiddle: riddle,
    };

    const connection = peer.connect(id, { metadata });

    markRaw(connection);

    connection.once('data', async (_data) => {
      const data = _data as CalleeHandshakeData;
      riddleChecker(data.calleeAuthenticationAnswer, solution, self);
      if (self.verification !== 'verified') return;

      const answerData: CallerHandshakeData = {
        callerAuthenticationAnswer: await decrypt(
          data.calleeAuthenticationRiddle,
        ),
      };

      connection.send(answerData);
    });

    return connection;
  }

  function remove(): void {
    self.connection?.close();
    contacts.value = contacts.value.filter((friend) => friend.id !== id);
  }

  async function acceptFriendRequest(): Promise<void> {
    self.status = 'friend';
    self.connection = await connect();
  }

  return self;
}

const contacts = ref(await getContactsFromStorage()) as Ref<WritableContact[]>;
const exportContacts = contacts as Ref<Contact[]>;
export { exportContacts as contacts };

watch(contacts, updateContactStorage, { deep: true });

peer.on('connection', async (connection) => {
  const foundContact = contacts.value.find((x) => x.id === connection.peer);

  if (
    foundContact?.status === 'friend' ||
    foundContact?.status === 'outgoing friend request'
  ) {
    const metadata: CallerMetadata = connection.metadata;

    markRaw(connection);

    foundContact.status = 'friend'; // 🤗
    foundContact.username = metadata.username;
    foundContact.connection = connection;
    foundContact.connected = true;

    calleHandshake(foundContact);
    return;
  }

  // 'incoming friend request', 'ignore' or "never heard of"
  connection.close();

  if (!foundContact) {
    contacts.value = [
      await newContact(
        connection.peer,
        'incoming friend request',
        connection.metadata.username,
      ),
      ...contacts.value,
    ];
    return;
  }
});

function riddleChecker(
  answer: unknown,
  solution: number[],
  friend: WritableContact,
): void {
  friend.verification =
    Array.isArray(answer) &&
    answer.length === solution.length &&
    answer.every((value, index) => value === solution[index])
      ? 'verified'
      : 'untrusted';

  if (friend.verification !== 'verified') {
    friend.connection!.close();
    throw new Error(
      `Contact "${friend.username}" failed to authenticate itself! Connection was closed.`,
    );
  }
}

async function calleHandshake(friend: Contact): Promise<void> {
  const connection = friend.connection!;

  const requestMetadata: CallerMetadata = connection.metadata;
  const answer = await decrypt(requestMetadata.callerAuthenticationRiddle);
  const { riddle, solution } = await generateRiddle(connection.peer);

  const data: CalleeHandshakeData = {
    message: 'Hello my friend',
    username: myUsername.value,
    calleeAuthenticationAnswer: answer,
    calleeAuthenticationRiddle: riddle,
  };

  // It seems like I can't send data just right after the
  // peer.on('connection') event. Waiting 500ms seem to work fine.
  await sleep(500);
  connection.send(data);

  connection.once('data', (_data) => {
    const data = _data as CallerHandshakeData;
    riddleChecker(data.callerAuthenticationAnswer, solution, friend);
  });
}

type StoredContactProps = {
  id: string;
  status: ContactStatus;
  username: string | undefined;
};

async function getContactsFromStorage(): Promise<Contact[]> {
  const raw = localStorage.getItem('contacts') ?? '[]';
  const storedProps: StoredContactProps[] = JSON.parse(raw);
  return await Promise.all(
    storedProps.map(({ id, status, username }) =>
      newContact(id, status, username),
    ),
  );
}

function updateContactStorage(): void {
  const storedProps: StoredContactProps[] = contacts.value.map((contact) => ({
    id: contact.id,
    status: contact.status,
    username: contact.username,
  }));
  const raw = JSON.stringify(storedProps);
  localStorage.setItem('contacts', raw);
}
