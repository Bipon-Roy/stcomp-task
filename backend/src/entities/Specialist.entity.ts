import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Media } from "./Media.entity";
import { VerificationStatus } from "./enums/specialist.enum";

@Entity({ name: "specialists" })
export class Specialist {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column("decimal", { precision: 3, scale: 2, default: 0 })
    average_rating!: string; // decimals come back as string

    @Column("boolean", { default: true })
    is_draft!: boolean;

    @Column("int", { default: 0 })
    total_number_of_ratings!: number;

    @Column("varchar", { length: 200 })
    title!: string;

    @Index({ unique: true })
    @Column("varchar", { length: 220 })
    slug!: string;

    @Column("text", { nullable: true })
    description?: string;

    @Column("decimal", { precision: 12, scale: 2, default: 0 })
    base_price!: string;

    @Column("decimal", { precision: 12, scale: 2, default: 0 })
    platform_fee!: string;

    @Column("decimal", { precision: 12, scale: 2, default: 0 })
    final_price!: string;

    @Column({
        type: "enum",
        enum: VerificationStatus,
        default: VerificationStatus.UNDERREVIEW,
    })
    verification_status!: VerificationStatus;

    @Column("boolean", { default: false })
    is_verified!: boolean;

    @Column("int", { default: 0 })
    duration_days!: number;

    @OneToMany(() => Media, (media) => media.specialist)
    media!: Media[];

    @CreateDateColumn({ type: "timestamptz" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at!: Date;

    @DeleteDateColumn({ type: "timestamptz", nullable: true })
    deleted_at?: Date | null;
}
