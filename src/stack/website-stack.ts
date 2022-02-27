import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import {StaticWebsite} from "./static-website"

export class WebsiteStack extends cdk.Stack {
  public constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new StaticWebsite(scope, "budget-app-static-site", {name:"budget-app"});
  }
}
