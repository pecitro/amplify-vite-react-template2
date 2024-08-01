import { Amplify } from 'aws-amplify';
import type { Handler } from 'aws-lambda';
import { generateClient } from "aws-amplify/data";

import type { Schema } from "../../data/resource";
import outputs from "../../../amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export const handler: Handler = async (event, context) => {
  await client.models.Todo.create({ content: event.message });
  console.log(event);
  // return { message: 'Hello, World!!' };
};

