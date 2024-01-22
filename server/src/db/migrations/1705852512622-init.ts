import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1705852512622 implements MigrationInterface {
  name = 'Init1705852512622';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "pauta" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "descricao" text NOT NULL, "categoria" character varying NOT NULL, CONSTRAINT "PK_01b1b6366dbd48e2f1f30c33dab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sessao_votacao" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "duracao" integer NOT NULL DEFAULT '60', "dataAbertura" TIMESTAMP WITH TIME ZONE NOT NULL, "resultado" character varying, "pautaId" uuid, CONSTRAINT "REL_6d8cfa5680d4b0979df41fd172" UNIQUE ("pautaId"), CONSTRAINT "PK_b0bb7b8d6f17607ac25a59aa659" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "usuario" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cpf" character varying NOT NULL, CONSTRAINT "UQ_28cd8597e57c8197d4929a98e7a" UNIQUE ("cpf"), CONSTRAINT "PK_a56c58e5cabaa04fb2c98d2d7e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "voto" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "voto" character varying NOT NULL, "sessaoId" uuid, "usuarioId" uuid, CONSTRAINT "PK_1ae3f3b9e79daf50838ea1ab5a3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "sessao_usuario_unique_key" ON "voto" ("sessaoId", "usuarioId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "sessao_votacao" ADD CONSTRAINT "FK_6d8cfa5680d4b0979df41fd1726" FOREIGN KEY ("pautaId") REFERENCES "pauta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "voto" ADD CONSTRAINT "FK_f2ea81244cd374e7a5b64f9861f" FOREIGN KEY ("sessaoId") REFERENCES "sessao_votacao"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "voto" ADD CONSTRAINT "FK_825a2941dab511826111930811d" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "voto" DROP CONSTRAINT "FK_825a2941dab511826111930811d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "voto" DROP CONSTRAINT "FK_f2ea81244cd374e7a5b64f9861f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessao_votacao" DROP CONSTRAINT "FK_6d8cfa5680d4b0979df41fd1726"`,
    );
    await queryRunner.query(`DROP INDEX "public"."sessao_usuario_unique_key"`);
    await queryRunner.query(`DROP TABLE "voto"`);
    await queryRunner.query(`DROP TABLE "usuario"`);
    await queryRunner.query(`DROP TABLE "sessao_votacao"`);
    await queryRunner.query(`DROP TABLE "pauta"`);
  }
}
