import * as cdk from "aws-cdk-lib";
import { WebsiteStack } from "./website-stack";

const app = new cdk.App();
new WebsiteStack(app, "budget-app-stack", {
  env: {
    region: "us-east-1",
    account: "661272765443",
  },
});
