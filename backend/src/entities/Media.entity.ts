import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Specialist } from "./Specialist.entity";
import { MediaType, MimeType } from "./enums/specialist.enum";

@Entity({ name: "media" })
export class Media {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Index()
    @ManyToOne(() => Specialist, (specialist) => specialist.media, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "specialists" })
    specialist!: Specialist;

    @Column("uuid")
    specialists!: string;

    @Column("varchar", { length: 255 })
    file_name!: string;

    @Column("int")
    file_size!: number;

    @Column("int", { default: 0 })
    display_order!: number;

    @Column("varchar", { length: 150 })
    file_id!: string;

    @Column({ type: "enum", enum: MimeType })
    mime_type!: MimeType;

    @Column({ type: "enum", enum: MediaType })
    media_type!: MediaType;

    @Column({ type: "timestamptz", nullable: true })
    uploaded_at?: Date;

    @DeleteDateColumn({ type: "timestamptz", nullable: true })
    deleted_at?: Date | null;

    @CreateDateColumn({ type: "timestamptz" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at!: Date;
}
