import { useLocalStorage } from '@vueuse/core';
import { DataConnection } from 'peerjs';
import { peer } from 'src/utils/peer';
import { ref } from 'vue';

class Friend {
  highlight = false;
  connection: DataConnection;

  constructor(readonly id: string) {
    this.connection = peer.value!.connect(id);
  }

  remove(): void {
    const position = friends.value.findIndex((friend) => friend.id === this.id);
    friendIds.value.delete(this.id);
    friends.value.splice(position, 1);
  }
}

export function addFriend(friendId: string): void {
  const friendFound = friends.value.find((friend) => friend.id === friendId);

  if (friendFound) {
    friendFound.highlight = true;
    setTimeout(() => (friendFound.highlight = false), 150);
    return;
  }

  friendIds.value.add(friendId);
  friends.value.push(new Friend(friendId));
}

const friendIds = useLocalStorage('friend-list', new Set<string>(), {
  serializer: {
    read: (rawArr: string) => new Set(JSON.parse(rawArr)),
    write: (set: Set<string>) => JSON.stringify([...set]),
  },
});

export const friends = ref<Friend[]>([]); // TODO fix this not truly deep reactive shizzle

friends.value = [...friendIds.value].map((id) => new Friend(id));
peer.value!.on('connection', (connection) => {
  const friend = friends.value.find((x) => x.id === connection.peer);
  if (!friend) return; // TODO send friend request

  friend.connection = connection;
});
