import termsOfServiceKo from "./terms_of_service.ko-KR.md?raw";
import termsOfServiceEn from "./terms_of_service.en-US.md?raw";
import privacyPolicyKo from "./privacy_policy.ko-KR.md?raw";
import privacyPolicyEn from "./privacy_policy.en-US.md?raw";
import marketingKo from "./marketing.ko-KR.md?raw";
import marketingEn from "./marketing.en-US.md?raw";

interface TermData {
  id: string;
  type: string;
  title: string;
  content: string;
  required: boolean;
}

function parseFrontmatter(raw: string): {
  meta: Record<string, string>;
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };

  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { meta, content: match[2].trim() };
}

function toTermData(raw: string, id: string): TermData {
  const { meta, content } = parseFrontmatter(raw);
  return {
    id,
    type: meta.type ?? id,
    title: meta.title ?? "",
    content,
    required: meta.required === "true",
  };
}

const allTerms: Record<string, TermData[]> = {
  "ko-KR": [
    toTermData(termsOfServiceKo, "terms_of_service_ko-KR"),
    toTermData(privacyPolicyKo, "privacy_policy_ko-KR"),
    toTermData(marketingKo, "marketing_ko-KR"),
  ],
  "en-US": [
    toTermData(termsOfServiceEn, "terms_of_service_en-US"),
    toTermData(privacyPolicyEn, "privacy_policy_en-US"),
    toTermData(marketingEn, "marketing_en-US"),
  ],
};

export function getTermsByLocale(locale: string): TermData[] {
  return allTerms[locale] ?? allTerms["en-US"];
}

export function getTermByType(
  type: string,
  locale: string,
): TermData | null {
  return getTermsByLocale(locale).find((t) => t.type === type) ?? null;
}
