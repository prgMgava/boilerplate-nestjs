import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRefreshToken1700344930058 implements MigrationInterface {
  name = 'CreateRefreshToken1700344930058';

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_rt_user"`);

    await queryRunner.query(`DROP TABLE "user"`);
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_token" ("id" uuid DEFAULT uuid_generate_v4(), "userId" uuid, "isRevoked" boolean, "expires" TIMESTAMP NOT NULL DEFAULT now(), "ip" character varying, "userAgent" character varying, "browser" character varying, "os" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2555dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_rt_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
