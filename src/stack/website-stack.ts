import * as cdk from "aws-cdk-lib";
import { CfnOutput } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import path from "node:path";
import { StaticWebsite } from "./static-website";

export class WebsiteStack extends cdk.Stack {
  public constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const clientId = new Secret(this, "client-id", {
      secretName: "monzo-client-id",
    });

    const clientSecret = new Secret(this, "client-secret", {
      secretName: "monzo-client-secret",
    });

    const redirectUrl = new Secret(this, "redirect-uri", {
      secretName: "monzo-redirect-url",
    });

    const authLambda = new NodejsFunction(
      this,
      `admin-create-user-email-sender`,
      {
        functionName: "budget-auth-function",
        entry: path.join(__dirname, "..", "auth-lambda", "handler.ts"),
        runtime: Runtime.NODEJS_14_X,
        memorySize: 2048,
        environment: {
          // MONZO_CLIENT_ID: clientId.secretValue.toString(),
          // MONZO_CLIENT_SECRET: clientSecret.secretValue.toString(),
          // MONZO_REDIRECT_URL: redirectUrl.secretValue.toString()
        },
        bundling: {
          sourceMap: true,
        },
      }
    );

    const api = new RestApi(this, "data-api", {
      restApiName: "budget-api",
      defaultCorsPreflightOptions: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
        ],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: ["http://localhost:3000"],
      },
    });

    const auth = api.root.addResource("auth");

    auth.addMethod("POST", new LambdaIntegration(authLambda));
    new StaticWebsite(this, "budget-app-static-site", { name: "budget-app" });

    const userPool = new UserPool(this, "budget-pool", {
      userPoolName: "budget-user-pool",
    });

    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
    });

    const client = userPool.addClient("Client", {
      disableOAuth: true,
    });

    new cdk.CfnOutput(this, "ClientId", {
      value: client.userPoolClientId,
    });
  }
}
