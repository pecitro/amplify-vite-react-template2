import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { sayHello } from './functions/say-hello/resource';
import * as appsync from 'aws-cdk-lib/aws-appsync';

const backend = defineBackend({
  auth,
  data,
  sayHello
});

backend.addOutput({
  custom: {
    sayHelloFunctionName: backend.sayHello.resources.lambda.functionName,
  },
});

const authenticatedUserIamRole = backend.auth.resources.authenticatedUserIamRole;
backend.sayHello.resources.lambda.grantInvoke(authenticatedUserIamRole);

backend.data.resources.graphqlApi.grant(
  backend.sayHello.resources.lambda,
  appsync.IamResource.all(),
  'appsync:GraphQL'
);

// // Lambda に AppSync GraphQL API を実行する権限を与える
// backend.data.resources.graphqlApi.grant(
//   backend.sayHello.resources.lambda,
//   cdk.aws_appsync.IamResource.all(),
//   'appsync:GraphQL'
// );

// // Lambda 関数の環境変数に AppSync のエンドポイント URL を設定
// backend.sayHello.resources.cfnResources.cfnFunction.environment = {
//   variables: {
//     ENDPOINT: backend.data.resources.cfnResources.cfnGraphqlApi.attrGraphQlUrl,
//   }
// };