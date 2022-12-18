import type { DataConnection } from 'peerjs';
import { peer, username as myUsername } from 'src/utils/peer';
import { Unreliable } from 'src/utils/utility-types';
import { reactive, ref, toRaw, watch } from 'vue';

type ContactStatus =
  | 'incoming friend request'
  | 'outgoing friend request'
  | 'friend'
  | 'ignore';

export class Contact {
  reactive = reactive({
    connected: false,
    highlight: false,
    status: 'ignore' as ContactStatus,
    username: undefined as string | undefined,
  });

  private _connection?: DataConnection;

  get connection() {
    return this._connection;
  }

  set connection(value) {
    this._connection = toRaw(value);

    this._connection?.on('open', () => {
      this.reactive.connected = true;
    });

    this._connection?.on('close', () => {
      this.reactive.connected = false;
    });

    this._connection?.on('iceStateChanged', (state) => {
      if (state === 'disconnected') this.reactive.connected = false;
    });

    this._connection?.on('data', (_data) => {
      const data = _data as Unreliable<Greetings>;
      if (data?.message === 'Hello my friend') {
        this.reactive.status = 'friend';
        this.reactive.username = data?.username ?? undefined;
      }
    });
  }

  constructor(
    public readonly id: string,
    status: ContactStatus,
    username: string | undefined = undefined,
  ) {
    this.reactive.status = status;
    this.reactive.username = username;

    if (
      this.reactive.status === 'friend' ||
      this.reactive.status === 'outgoing friend request'
    )
      this.connection = this.connect();
  }

  remove(): void {
    this.connection?.close();
    contacts.value = contacts.value.filter((friend) => friend.id !== this.id);
  }

  acceptFriendRequest(): void {
    this.reactive.status = 'friend';
    this.connection = this.connect();
  }

  private connect(): DataConnection {
    return peer.connect(this.id, { metadata: { username: myUsername.value } });
  }
}

export const contacts = ref(getContactsFromStorage());

watch(contacts, updateContactStorage, { deep: true });

peer.on('connection', (connection) => {
  const foundContact = contacts.value.find((x) => x.id === connection.peer);

  if (foundContact?.reactive.status === 'outgoing friend request') {
    foundContact.reactive.status = 'friend'; // 🤗
    foundContact.reactive.username = connection.metadata.username;
    greet(connection);
  }

  if (foundContact?.reactive.status === 'friend') {
    foundContact.connection = connection;
    foundContact.reactive.connected = true;
    greet(connection);
    return;
  }

  // 'incoming friend request', 'ignore' or "never heard of"
  connection.close();

  if (!foundContact) {
    contacts.value = [
      new Contact(
        connection.peer,
        'incoming friend request',
        connection.metadata.username,
      ),
      ...contacts.value,
    ];
    return;
  }
});

type Greetings = { message: 'Hello my friend'; username: string };
function greet(connection: DataConnection): void {
  setTimeout(() => {
    const greetings: Greetings = {
      message: 'Hello my friend',
      username: myUsername.value,
    };
    connection!.send(greetings);
  }, 500);
}

type StoredContactProps = {
  id: string;
  status: ContactStatus;
  username: string | undefined;
};

function getContactsFromStorage(): Contact[] {
  const raw = localStorage.getItem('contacts') ?? '[]';
  const storedProps: StoredContactProps[] = JSON.parse(raw);
  return storedProps.map(
    ({ id, status, username }) => new Contact(id, status, username),
  );
}

function updateContactStorage(): void {
  const storedProps: StoredContactProps[] = contacts.value.map((contact) => ({
    id: contact.id,
    status: contact.reactive.status,
    username: contact.reactive.username,
  }));
  const raw = JSON.stringify(storedProps);
  localStorage.setItem('contacts', raw);
}
