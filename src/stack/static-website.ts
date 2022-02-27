import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53Targets from "aws-cdk-lib/aws-route53-targets";
import { Construct } from "constructs";
import * as certificateManager from "aws-cdk-lib/aws-certificatemanager";

interface StaticWebsiteProps {
  name: string;
  domainName?: string;
}

const INDEX_DOT_HTML = "index.html";

const makeDomain = (context: Construct, domainName: string | undefined) => {
  if (!domainName) {
    return undefined;
  }

  const zone = route53.HostedZone.fromLookup(context, "MyHostedZone", {
    domainName,
  });

  return {
    zone,
    certificate: new certificateManager.DnsValidatedCertificate(
      context,
      "static-site-cert",
      {
        domainName,
        hostedZone: zone,
        subjectAlternativeNames: [`www.${domainName}`],
      }
    ),
  };
};

export class StaticWebsite extends Construct {
  constructor(scope: Construct, id: string, props: StaticWebsiteProps) {
    super(scope, id);

    const { domainName } = props;

    const bucket = new s3.Bucket(this, "assets-bucket", {
      bucketName: domainName,
      publicReadAccess: true,
      websiteIndexDocument: INDEX_DOT_HTML,
      websiteErrorDocument: INDEX_DOT_HTML,
    });

    new cdk.CfnOutput(this, "bucket-output", {
      exportName: `${props.name}-assets-bucket`,
      value: bucket.bucketName,
    });

    const domain = makeDomain(this, domainName);

    const viewerCertificate =
      domain && domainName
        ? {
            viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
              domain.certificate,
              { aliases: [domainName, `www.${domainName}`] }
            ),
          }
        : {};

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
        ...viewerCertificate,
      }
    );

    new cdk.CfnOutput(this, "api-output", {
      exportName: "static-site-distribution-id",
      value: distribution.distributionId,
    });

    if (domain && domainName) {
      new route53.ARecord(this, "ARecord", {
        zone: domain.zone,
        target: route53.RecordTarget.fromAlias(
          new route53Targets.CloudFrontTarget(distribution)
        ),
      });

      new route53.CnameRecord(this, "CNameRecord", {
        zone: domain.zone,
        domainName,
        recordName: `www.${domainName}`,
      });
    }
  }
}
