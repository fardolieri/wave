import type { DataConnection } from 'peerjs';
import type { Writable } from 'type-fest';
import { reactive, Ref, ref, watch } from 'vue';
import { newContactConnection } from './contact-connection';

type ContactStatus =
  | 'incoming friend request'
  | 'outgoing friend request'
  | 'friend'
  | 'ignore';

type VerificationStatus = 'pending' | 'verified' | 'untrusted';

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

export async function newContact(
  id: string,
  status: ContactStatus,
  username?: string,
): Promise<Contact> {
  const self: Writable<Contact> = reactive({
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

  if (status === 'friend' || status === 'outgoing friend request')
    self.connection = await newContactConnection(self);

  function remove(): void {
    self.connection?.close();
    contacts.value = contacts.value.filter((friend) => friend.id !== id);
  }

  async function acceptFriendRequest(): Promise<void> {
    self.status = 'friend';
    self.connection = await newContactConnection(self);
  }

  return self;
}

const contacts = ref(await getContactsFromStorage());
const exportContacts = contacts as Ref<Contact[]>;
export { exportContacts as contacts };

watch(contacts, updateContactStorage, { deep: true });

type StoredContactProps = {
  id: string;
  status: ContactStatus;
  username: string | undefined;
};

async function getContactsFromStorage(): Promise<Writable<Contact>[]> {
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
