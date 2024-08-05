import { Amplify } from 'aws-amplify';
import type { Handler } from 'aws-lambda';
import { generateClient } from "aws-amplify/data";

import type { Schema } from "../../data/resource";
import { env } from '$amplify/env/say-hello';
import { createTodo } from './mutations';

// スキーマを書き換えたら、以下のコマンドを実行してGraphQLクライアントを再生成する
// npx ampx generate graphql-client-code

Amplify.configure(
  {
    API: {
      GraphQL: {
        endpoint: env.AMPLIFY_DATA_GRAPHQL_ENDPOINT,
        region: env.AWS_REGION,
        defaultAuthMode: 'identityPool',
      }
    }
  },
  {
    Auth: {
      credentialsProvider: {
        getCredentialsAndIdentityId: async () => ({
          credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
            sessionToken: env.AWS_SESSION_TOKEN
          }
        }),
        clearCredentialsAndIdentityId: () => { }
      }
    }
  }
);


const client = generateClient<Schema>();

export const handler: Handler = async (event, context) => {
  console.log(event);
  console.log(client);

  await client.graphql({
    query: createTodo,
    variables: {
      input: {
        content: event.message
      }
    }
  });
};

