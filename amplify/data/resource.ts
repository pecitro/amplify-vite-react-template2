import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { sayHello } from "../functions/say-hello/resource";

const schema = a.schema({
  Todo: a.model({
    content: a.string(),
  }).authorization((allow) => [
    allow.authenticated("userPools").to(["read"]),
  ]),
}).authorization(allow => [allow.resource(sayHello)]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
