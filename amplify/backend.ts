import { defineBackend } from '@aws-amplify/backend';
import { CfnOutput, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { FunctionUrlAuthType, HttpMethod } from 'aws-cdk-lib/aws-lambda';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { BlockPublicAccess, Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { AllowedMethods, CachePolicy, Distribution, PriceClass, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { contact } from './functions/contact/resource';

const backend = defineBackend({ contact });

/* ---------- Contact form: Lambda function URL -> SES ---------- */
const fn = backend.contact.resources.lambda;
const contactUrl = fn.addFunctionUrl({
  authType: FunctionUrlAuthType.NONE,
  cors: {
    allowedOrigins: ['https://afhcgolf.net', 'https://www.afhcgolf.net', 'http://localhost:4321'],
    allowedMethods: [HttpMethod.POST],
    allowedHeaders: ['content-type'],
  },
});
fn.addToRolePolicy(new PolicyStatement({
  actions: ['ses:SendEmail'],
  resources: [`arn:aws:ses:${backend.stack.region}:${backend.stack.account}:identity/afhcgolf.net`],
}));

/* ---------- Media: private S3 bucket behind CloudFront ---------- */
const mediaStack = backend.createStack('media');
const bucket = new Bucket(mediaStack, 'Media', {
  blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
  encryption: BucketEncryption.S3_MANAGED,
  enforceSSL: true,
  versioned: true,
  removalPolicy: RemovalPolicy.RETAIN, // never delete the photos with a stack
});
const cdn = new Distribution(mediaStack, 'MediaCdn', {
  comment: 'afhcgolf.net media (/uploads/*)',
  defaultBehavior: {
    origin: S3BucketOrigin.withOriginAccessControl(bucket),
    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
    cachePolicy: CachePolicy.CACHING_OPTIMIZED,
  },
  priceClass: PriceClass.PRICE_CLASS_100,
  errorResponses: [{ httpStatus: 403, responseHttpStatus: 404, ttl: Duration.minutes(5) }],
});
new CfnOutput(mediaStack, 'MediaBucketName', { value: bucket.bucketName });

backend.addOutput({
  custom: {
    contactUrl: contactUrl.url,
    mediaUrl: `https://${cdn.distributionDomainName}`,
    mediaBucket: bucket.bucketName,
  },
});
