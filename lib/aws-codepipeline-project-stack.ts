import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import { CDKPipelineStage } from './stage';

export class AwsCodepipelineProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'CDKTestPipeline',       // Creating a new code pipeline which is a construct
      synth: new ShellStep('Synth', {        // Add a new synthesis 'shellstep' which will be pointed at our gihub repository 
        input: CodePipelineSource.gitHub('13512168905/aws-codepipeline-project', 'main'), // replace the GitHub repository name with 'user-name/repository-name'
        
        // The build steps for the pipeline are defined by these commands
        
        commands: ['npm ci',
                   'npm run build',
                   'npx cdk synth']
      }),
    });

    // add the following code snippet to pass the stage

    const testStage = pipeline.addStage(new CDKPipelineStage(this, "test", {
      env: { account:"920163460857", region: "eu-central-1"}            //replace this with your aws-account-id and aws-region
    }));

    testStage.addPost(new ManualApprovalStep('Manaul approval step'));

    const productionStage = pipeline.addStage(new CDKPipelineStage(this, "production", {
      env: { account:"920163460857", region: "eu-central-1"}            //replace this with your aws-account-id and aws-region
    }));

  }
}