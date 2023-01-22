import type { DataConnection } from 'peerjs';
import { peer } from 'src/utils/peer';
import { myUsername } from 'src/utils/username';
import type { Writable } from 'type-fest';
import { markRaw } from 'vue';
import { Contact as _Contact, contacts, newContact } from './friends';
import { decrypt, generateRiddle } from './security';
import { sleep } from './sleep';

/**
 * Client A                                      Client B
 *  CALLER                                        CALLEE
 *  (1) |--- CallerMetadata: username + riddle ----->| (1)
 *      |                                            |
 *  (2) |<-- CalleeHandshakeData: answer + riddle ---| (2)
 *      |                                            |
 *  (3) |--- CallerHandshakeData: answer ----------->| (3)
 *      |                                            |
 *  (4) |<-- CalleeIntroduction: username -----------| (4)
 */

type CallerMetadata = {
  username: string;
  callerRiddle: number[];
};

type CalleeHandshakeData = {
  calleeAnswer: number[];
  calleeRiddle: number[];
};

type CallerHandshakeData = {
  callerAnswer: number[];
};

type CalleeIntroduction = {
  message: 'Hello my friend';
  username: string;
};

// I explicitly allow this module to write the Contact props
type Contact = Writable<_Contact>;

export async function newContactConnection(
  contact: Contact,
): Promise<DataConnection> {
  const { riddle, solution } = await generateRiddle(contact.id);

  const metadata: CallerMetadata = {
    username: myUsername.value,
    callerRiddle: riddle,
  };

  const connection = peer.connect(contact.id, { metadata }); // CALLER (1)

  markRaw(connection);

  connection.once('data', async (_data) => {
    // CALLER (2)
    const data = _data as CalleeHandshakeData;
    contact.verification = 'pending';
    const checkResult = riddleChecker(data.calleeAnswer, solution);

    if (checkResult !== 'verified') {
      connection.close();
      console.error('Contact could not authenticate itself.', connection);
      contact.verification = 'untrusted';
      return;
    }

    const answerData: CallerHandshakeData = {
      callerAnswer: await decrypt(data.calleeRiddle),
    };

    connection.send(answerData); // CALLER (3)

    connection.once('data', (_data) => {
      // CALLER (4)
      const data = _data as CalleeIntroduction;
      if (data?.message === 'Hello my friend') {
        contact.verification = 'verified';
        contact.status = 'friend';
        contact.username = data.username;
      }
    });
  });

  connection.on('open', () => {
    contact.connected = true;
  });

  connection.on('close', () => {
    contact.connected = false;
  });

  connection.on('iceStateChanged', (state) => {
    if (state === 'disconnected') contact.connected = false;
  });

  return connection;
}

peer.on('connection', async (connection) => {
  // CALLEE (1)
  const foundContact = contacts.value.find((x) => x.id === connection.peer) as
    | Contact
    | undefined;

  try {
    foundContact && (foundContact.verification = 'pending');
    await authenticateCaller(connection);
    foundContact && (foundContact.verification = 'verified');
  } catch (err) {
    console.error(err);
    foundContact && (foundContact.verification = 'untrusted');
    connection.close();
    return;
  }

  if (foundContact?.status === 'outgoing friend request') {
    const metadata: CallerMetadata = connection.metadata;
    foundContact.status = 'friend'; // 🤗
    foundContact.username = metadata.username;
  }

  if (foundContact?.status === 'friend') {
    markRaw(connection);
    foundContact.connection = connection;
    foundContact.connected = true;
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

async function authenticateCaller(connection: DataConnection) {
  const requestMetadata = connection.metadata as CallerMetadata;
  const answer = await decrypt(requestMetadata.callerRiddle);
  const { riddle, solution } = await generateRiddle(connection.peer);

  const data: CalleeHandshakeData = {
    calleeAnswer: answer,
    calleeRiddle: riddle,
  };

  // It seems like I can't send data just right after the
  // peer.on('connection') event. Waiting 500ms seem to work fine.
  await sleep(500);
  connection.send(data); // CALLEE (2)

  await new Promise<void>((resolve, reject) => {
    connection.once('data', (_data) => {
      // CALLEE (3)
      const data = _data as CallerHandshakeData;
      const checkResult = riddleChecker(data.callerAnswer, solution);
      if (checkResult !== 'verified') {
        connection.close();
        console.error('Contact could not authenticate itself.', connection);
        reject();
        return;
      }

      const introduction: CalleeIntroduction = {
        message: 'Hello my friend',
        username: myUsername.value,
      };

      connection.send(introduction); // CALLEE (4)
      resolve();
    });
  });
}

function riddleChecker(answer: unknown, solution: number[]) {
  return Array.isArray(answer) &&
    answer.length === solution.length &&
    answer.every((value, index) => value === solution[index])
    ? 'verified'
    : 'untrusted';
}
