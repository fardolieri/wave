import type { DataConnection } from 'peerjs';
import { Notify } from 'quasar';
import { peer, username as myUsername } from 'src/utils/peer';
import { reactive, ref, toRaw, watch } from 'vue';

export class Friend {
  highlight = false;
  reactiveStatus = reactive({ open: false });

  constructor(
    public readonly id: string,
    public status:
      | 'incoming friend request'
      | 'outgoing friend request'
      | 'friends',
    public username: string | undefined = undefined,
    public connection = toRaw(
      peer.value.connect(id, {
        metadata: { username: myUsername.value },
      }),
    ),
  ) {
    notifyConnection(this.connection, this.username ?? this.id);
    this.connection.on('open', () => (this.reactiveStatus.open = true));
    this.connection.on('close', () => (this.reactiveStatus.open = false));
  }

  remove(): void {
    this.connection.close();
    friends.value = friends.value.filter((friend) => friend.id !== this.id);
  }
}

export const friends = ref(getFriendsFromStorage());

watch(friends, updateFriendStorage, { deep: true });

peer.value.on('connection', (connection) => {
  const friend = friends.value.find((x) => x.id === connection.peer);
  notifyConnection(connection, friend?.username ?? connection.peer);

  if (!friend) {
    connection.close();
    friends.value = [
      ...friends.value,
      new Friend(
        connection.peer,
        'incoming friend request',
        connection.metadata?.username,
        connection,
      ),
    ];
    return;
  }

  if (friend.status === 'outgoing friend request') {
    friend.status = 'friends'; // 🤗
    friend.username = connection.metadata.username;
  }

  friend.connection = connection;
  friend.reactiveStatus.open = true;
  friend.connection.on('open', () => (friend.reactiveStatus.open = true));
  friend.connection.on('close', () => (friend.reactiveStatus.open = false));
});

type StoredFriendProps = Pick<Friend, 'id' | 'status' | 'username'>;

function getFriendsFromStorage(): Friend[] {
  const raw = localStorage.getItem('friend-list') ?? '[]';
  const storedProps: StoredFriendProps[] = JSON.parse(raw);
  return storedProps.map(
    ({ id, status, username }) => new Friend(id, status, username),
  );
}

function updateFriendStorage(): void {
  const storedProps: StoredFriendProps[] = friends.value.map(
    ({ id, status, username }) => ({ id, status, username }),
  );
  const raw = JSON.stringify(storedProps);
  localStorage.setItem('friend-list', raw);
}

function notifyConnection(connection: DataConnection, username: string): void {
  connection.on('open', () => {
    Notify.create(`Connected to ${username}`);
  });
  connection.on('data', (data) => {
    Notify.create(
      `Data received from ${username}:\n${JSON.stringify(data, null, 2)}`,
    );
  });
  connection.on('close', () => {
    Notify.create(`Connection to ${username} closed.`);
  });
  connection.on('error', (error) => {
    Notify.create(
      `An error occured while connecting to ${username}:\n${error}`,
    );
  });
  connection.on('iceStateChanged', (state) => {
    Notify.create(`iceStateChanged of ${username} changed:\n${state}`);
  });
}
