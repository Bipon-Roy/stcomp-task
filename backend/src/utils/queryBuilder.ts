import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

export type SortOrder = "ASC" | "DESC";

export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
};

export function normalizePageLimit(page = 1, limit = 10) {
    const safePage = Number.isFinite(page) && page > 0 ? page : 1;
    const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 10;
    return { page: safePage, limit: safeLimit };
}

export function applySearch<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    opts: {
        term?: string;
        columns: string[]; // e.g. ["s.title", "s.slug"]
        paramName?: string;
    }
) {
    const term = (opts.term ?? "").trim();
    if (!term) return qb;

    const p = opts.paramName ?? "search";
    const like = `%${term}%`;

    // (col ILIKE :search OR col2 ILIKE :search ...)
    const where = opts.columns.map((c, idx) => `${c} ILIKE :${p}`).join(" OR ");
    qb.andWhere(`(${where})`, { [p]: like });

    return qb;
}

export function applyEnumFilter<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    opts: {
        value?: string;
        column: string; // e.g. "s.verification_status"
        allowed: readonly string[];
        paramName?: string;
    }
) {
    const v = (opts.value ?? "").trim();
    if (!v) return qb;

    // only apply if valid enum value
    if (!opts.allowed.includes(v)) return qb;

    qb.andWhere(`${opts.column} = :${opts.paramName ?? "enumValue"}`, {
        [opts.paramName ?? "enumValue"]: v,
    });

    return qb;
}

export function applyBooleanFilter<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    opts: { value?: boolean; column: string; paramName?: string }
) {
    if (typeof opts.value !== "boolean") return qb;
    qb.andWhere(`${opts.column} = :${opts.paramName ?? "boolValue"}`, {
        [opts.paramName ?? "boolValue"]: opts.value,
    });
    return qb;
}

export function applySort<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    opts: {
        sortBy?: string;
        order?: SortOrder;
        // whitelist to prevent SQL injection
        allowed: Record<string, string>; // { "created_at": "s.created_at", "price": "s.final_price" }
        defaultSort?: { column: string; order: SortOrder };
    }
) {
    const order = (opts.order ?? "DESC").toUpperCase() as SortOrder;

    const mapped = opts.sortBy ? opts.allowed[opts.sortBy] : undefined;

    if (mapped) {
        qb.orderBy(mapped, order);
        return qb;
    }

    if (opts.defaultSort) {
        qb.orderBy(opts.defaultSort.column, opts.defaultSort.order);
    }

    return qb;
}

export async function paginate<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    page: number,
    limit: number
): Promise<{ skip: number; take: number; meta: Omit<PaginationMeta, "total" | "totalPages" | "hasNext" | "hasPrev"> }> {
    const { page: p, limit: l } = normalizePageLimit(page, limit);
    const skip = (p - 1) * l;
    const take = l;

    qb.skip(skip).take(take);

    return {
        skip,
        take,
        meta: { page: p, limit: l },
    };
}

export function buildMeta(page: number, limit: number, total: number): PaginationMeta {
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
    };
}
