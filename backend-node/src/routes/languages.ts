import { Router } from "express";
import { supabaseAdmin } from "../lib/supabase.js";

export const languagesRouter = Router();

languagesRouter.get("/", async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from("coding_languages")
    .select("id, name, slug, version, template_code, file_extension")
    .order("name");

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  const items = (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    version: row.version,
    template_code: row.template_code,
    file_extension: row.file_extension,
  }));

  res.json(items);
});
