import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { sayHello } from './functions/say-hello/resource';
import * as iot from 'aws-cdk-lib/aws-iot'
import * as iam from 'aws-cdk-lib/aws-iam'

const backend = defineBackend({
  auth,
  data,
  sayHello
});


const customResourceStack = backend.createStack('CustomResourceStack');

const topic_rule = new iot.CfnTopicRule(customResourceStack, "MyTopicRule", {
  topicRulePayload: {
    sql: "SELECT * FROM 'iot/#'",
    actions: [
      {
        lambda: {
          functionArn: backend.sayHello.resources.lambda.functionArn
        }
      }
    ]
  }
});

// const iamArnPrincipal = new iam.ArnPrincipal(topic_rule.attrArn);
const iotServicePrincipal = new iam.ServicePrincipal('iot.amazonaws.com');
backend.sayHello.resources.lambda.grantInvoke(iotServicePrincipal);

// amplify_outputs.jsonにLambda関数名を出力する
backend.addOutput({
  custom: {
    sayHelloFunctionName: backend.sayHello.resources.lambda.functionName,
  },
});
