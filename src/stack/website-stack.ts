import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apiGateway from "aws-cdk-lib/aws-apigateway";
import * as certificateManager from "aws-cdk-lib/aws-certificatemanager";

import { ARecord, RecordTarget } from "aws-cdk-lib/aws-route53";
import { ApiGatewayDomain } from "aws-cdk-lib/aws-route53-targets";

export class WebsiteStack extends cdk.Stack {
  public constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const domainName = "simple-budget-app.co.uk";

    const bucket = new s3.Bucket(this, "simple-budget-app-bucket", {
      bucketName: domainName,
      publicReadAccess: true,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
    });

    new cdk.CfnOutput(this, "bucket-output", {
      exportName: "bucket",
      value: bucket.bucketName,
    });

    route53.HostedZone.fromLookup(this, "MyHostedZone", {
      domainName,
    });

    // const certificate = new certificateManager.DnsValidatedCertificate(
    //   this,
    //   "BensWebsiteCertificate",
    //   {
    //     domainName,
    //     hostedZone: zone,
    //     subjectAlternativeNames: [`www.${domainName}`],
    //   }
    // );

    // const apiCertificate = new certificateManager.DnsValidatedCertificate(
    //   this,
    //   "apiCertificate",
    //   {
    //     domainName: `api.${domainName}`,
    //     hostedZone: zone,
    //   }
    // );

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "CloudfrontDistribution",
      {
        originConfigs: [
          {
            customOriginSource: {
              domainName: bucket.bucketWebsiteDomainName,
              originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
        // viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
        //   certificate,
        //   { aliases: [domainName, `www.${domainName}`] }
        // ),
      }
    );

    new cdk.CfnOutput(this, "api-output", {
      exportName: "distribution",
      value: distribution.distributionId,
    });

    // new route53.ARecord(this, "ARecord", {
    //   zone,
    //   target: route53.RecordTarget.fromAlias(
    //     new route53Targets.CloudFrontTarget(distribution)
    //   ),
    // });

    // new route53.CnameRecord(this, "CNameRecord", {
    //   zone,
    //   domainName,
    //   recordName: `www.${domainName}`,
    // });
  }
}
