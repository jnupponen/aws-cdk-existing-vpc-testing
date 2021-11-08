import * as cdk from '@aws-cdk/core'
import { CfnParameter } from '@aws-cdk/core'
import * as rds from '@aws-cdk/aws-rds'
import * as ec2 from '@aws-cdk/aws-ec2'
export class RdsStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        const vpcId = new CfnParameter(this, 'RDSParamVpcId', { type: 'string' })
        const subnetId = new CfnParameter(this, 'RDSParamSubnetId', { type: 'string' })

        const vpc = ec2.Vpc.fromVpcAttributes(this, 'VPC', {
            vpcId: vpcId.valueAsString,
            availabilityZones: [''], // shouldn't matter here
            privateSubnetIds: [subnetId.valueAsString, 'subnet-2345']
        })
        const dbProps = rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_26 })

        new rds.DatabaseInstance(this, 'rds', { engine: dbProps, vpc: vpc, multiAz: true })
    }
}
