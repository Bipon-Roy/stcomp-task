import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("varchar", { length: 50 })
    name!: string;

    @Index({ unique: true })
    @Column("varchar", { length: 150 })
    email!: string;

    @Column("text")
    password!: string;

    @Column("text", { nullable: true })
    accessToken?: string | null;

    @Column("text", { nullable: true })
    refreshToken?: string | null;

    @CreateDateColumn({ type: "timestamptz" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at!: Date;
}
