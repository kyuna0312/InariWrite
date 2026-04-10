# Нэмэлт модулиуд (`@inariwrite/core`) — Монгол тайлбар

**Англи хувилбар:** [plugins.md](plugins.md) (албан ёсны нарийвчилсан баримт).  
**Агуулгын индекс:** [README.md](README.md) · **Бүтэц:** [architecture.md](architecture.md) · **CLI:** [README](../README.md#cli)

InariWrite нь анхдагч **GFM** (GitHub Flavored Markdown) дамжлагыг **remark** болон **rehype**-ийн жижиг, тогтвортой **plugin**-ээр өргөжүүлэх боломж өгдөг.

## `MarkdownPlugin` гэж юу вэ?

Энэ нь таны **нэг** өргөтгөлийг тодорхойлдог объект: ямар **remark** болон **rehype** нэмэлтүүд ажиллахыг жагсаана.

```ts
import type { MarkdownPlugin } from "@inariwrite/core";

const myPlugin: MarkdownPlugin = {
  name: "my-org/my-plugin",
  remarkPlugins: [myRemarkPlugin, [myRemarkPluginWithOptions, { flag: true }]],
  rehypePlugins: [myRehypePlugin],
};
```

Жагсаалтын **элемент бүр** нь unified-ийн **`Pluggable`** хэлбэртэй: зөвхөн функц, эсвэл **`[plugin, сонголтууд]`** хослол. Дарааллыг хадгалж `processor.use(...)`-ээр оруулна.

`defineMarkdownPlugin()` нь **TypeScript төрөл** сайжруулсан туслах функц; үр дүн нь дээрх объекттой ижил.

### Plugin-ууд хаана ажиллах вэ?

| Талбар | Алхам |
|--------|--------|
| **`remarkPlugins`** | **remark-gfm**-ийн дараа, **remark-rehype**-ийн өмнө |
| **`rehypePlugins`** | **remark-rehype**-ийн дараа, **rehype-sanitize**-ийн өмнө |

**Товчхондоо:** эхлээд Markdown-ийг AST болгож (remark), дараа нь HTML руу (rehype), эцэст нь аюулгүй байдлын **sanitize** хэрэгжинэ. Таны plugin-ууд эдгээр үе шатуудын дунд ороод орно.

## `{ plugins }` дамжуулдаг API-ууд

| API | Plugin-ийн нөлөө |
|-----|-------------------|
| `parseMarkdown(markdown, { plugins })` | Зөвхөн **remark** үе |
| `markdownToHtml(markdown, { plugins })` | **Remark + rehype** |
| `markdownToHtmlDocument(markdown, { plugins, … })` | `markdownToHtml`-тэй ижил |
| `listRelativeMarkdownFileLinks(markdown, { plugins })` | Зөвхөн remark; CLI **`check`** команд энд тулгуурлана |

## CLI: тохиргоо файл ба `--plugin`

**`inariwrite preview`**, **`build`**, **`check`** нь вэб апптай ижил анхдагч plugin-уудыг ашиглана (эхлээд **`@inariwrite/plugin-sample`**). Нэмэлт нэмэх арга:

| Арга зам | Тайлбар |
|----------|---------|
| **Тохиргооны файл** (одоогийн ажлын хавтас) | `inariwrite.config.mjs` / `.js` / `.cjs` — `export default { markdownPlugins: […] }` эсвэл нэг plugin экспорт, эсвэл `export const markdownPlugins = […]` |
| **`--plugin <specs>`** | Таслалаар тусгаарласан модулийн зам (npm эсвэл `./файл.mjs`). **Тохиргооны plugin-уудын дараа** ачаалагдана. |
| **`-c, --config <файл>`** | Автомат хайлтыг алгасаж тодорхой файл ашиглана. |

## Жишээ: `@inariwrite/plugin-sample`

Текст доторх **`:inari:`**-ийг 🦊 болгож солино. **Вэб урьдчилан харах worker** (болон гол урсгалын нөөц зам) дээр холбогдсон; CLI **`preview` / `build` / `check`**-д **эхний** plugin. Бусдыг тохиргоо эсвэл **`--plugin`**-ээр нэмнэ.

## Вэб урьдчилан харах Web Worker

`Worker` байвал HTML-ийг **тусдаа worker**-т гүйцэтгэж UI-г чөлөөлнө. Plugin-ийн жагсаалт нөөц (main thread) замтай ижил. Хэдэн секундын дотор worker хариу өгөхгүй бол **гол урсгал руу шилжинэ** (PWA, тестийн тохиолдолд тустай).

## Хүнд plugin (Shiki, Mermaid, г.м.)

Анхдагчид ороогүй (багцын хэмжээ). Зөвлөмж:

1. Жишээ нь `rehype-shiki` ороосон **`MarkdownPlugin`** бичих.  
2. Plugin дотор **хойшлуулсан `import()`** эсвэл зөвхөн **worker** дээр ачаалах — эхний ачаалал бага байна.  
3. Өөрийн rehype plugin-уудын **дараа** **`rehype-sanitize`** үлдээнэ, эсвэл шинэ tag/class-д **sanitize schema**-г зориуд өргөтгөнө.

---

*Кодын нэр, пакетын зам, CLI тушаалуудыг англиар хэвээр үлдээсэн нь хөгжүүлэгчдийн нэгдсэн нэршилтэй нийцэх зорилготой.*
