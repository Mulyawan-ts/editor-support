// URUS Language Plugin for Acode Editor v0.3.0
// Full language support: syntax highlighting, auto-complete, snippets, folding

// ─── Built-in Function Database ────────────────────────────────
const URUS_BUILTINS = [
  // I/O
  { name: "print", sig: "fn print(value: any): void", meta: "I/O", doc: "Print value to stdout" },
  { name: "input", sig: "fn input(): str", meta: "I/O", doc: "Read line from stdin" },
  { name: "read_file", sig: "fn read_file(path: str): str", meta: "I/O", doc: "Read file contents" },
  { name: "write_file", sig: "fn write_file(path: str, content: str): void", meta: "I/O", doc: "Write to file" },
  { name: "append_file", sig: "fn append_file(path: str, content: str): void", meta: "I/O", doc: "Append to file" },
  // Array
  { name: "len", sig: "fn len(arr: [T]): int", meta: "Array", doc: "Get array length" },
  { name: "push", sig: "fn push(arr: [T], value: T): void", meta: "Array", doc: "Append to array" },
  { name: "pop", sig: "fn pop(arr: [T]): void", meta: "Array", doc: "Remove last element" },
  // String
  { name: "str_len", sig: "fn str_len(s: str): int", meta: "String", doc: "String length" },
  { name: "str_upper", sig: "fn str_upper(s: str): str", meta: "String", doc: "To uppercase" },
  { name: "str_lower", sig: "fn str_lower(s: str): str", meta: "String", doc: "To lowercase" },
  { name: "str_trim", sig: "fn str_trim(s: str): str", meta: "String", doc: "Trim whitespace" },
  { name: "str_contains", sig: "fn str_contains(s: str, sub: str): bool", meta: "String", doc: "Check contains" },
  { name: "str_find", sig: "fn str_find(s: str, sub: str): int", meta: "String", doc: "Find index (-1 if not found)" },
  { name: "str_slice", sig: "fn str_slice(s: str, start: int, end: int): str", meta: "String", doc: "Get substring" },
  { name: "str_replace", sig: "fn str_replace(s: str, old: str, new: str): str", meta: "String", doc: "Replace all" },
  { name: "str_starts_with", sig: "fn str_starts_with(s: str, prefix: str): bool", meta: "String", doc: "Check prefix" },
  { name: "str_ends_with", sig: "fn str_ends_with(s: str, suffix: str): bool", meta: "String", doc: "Check suffix" },
  { name: "str_split", sig: "fn str_split(s: str, delim: str): [str]", meta: "String", doc: "Split by delimiter" },
  { name: "char_at", sig: "fn char_at(s: str, i: int): str", meta: "String", doc: "Get char at index" },
  // Conversion
  { name: "to_str", sig: "fn to_str(value: any): str", meta: "Convert", doc: "Convert to string" },
  { name: "to_int", sig: "fn to_int(value: any): int", meta: "Convert", doc: "Convert to int" },
  { name: "to_float", sig: "fn to_float(value: any): float", meta: "Convert", doc: "Convert to float" },
  // Math
  { name: "abs", sig: "fn abs(x: int): int", meta: "Math", doc: "Absolute value (int)" },
  { name: "fabs", sig: "fn fabs(x: float): float", meta: "Math", doc: "Absolute value (float)" },
  { name: "sqrt", sig: "fn sqrt(x: float): float", meta: "Math", doc: "Square root" },
  { name: "pow", sig: "fn pow(x: float, y: float): float", meta: "Math", doc: "Power x^y" },
  { name: "min", sig: "fn min(a: int, b: int): int", meta: "Math", doc: "Min of two ints" },
  { name: "max", sig: "fn max(a: int, b: int): int", meta: "Math", doc: "Max of two ints" },
  { name: "fmin", sig: "fn fmin(a: float, b: float): float", meta: "Math", doc: "Min of two floats" },
  { name: "fmax", sig: "fn fmax(a: float, b: float): float", meta: "Math", doc: "Max of two floats" },
  // Result
  { name: "is_ok", sig: "fn is_ok(r: Result): bool", meta: "Result", doc: "Check if Ok" },
  { name: "is_err", sig: "fn is_err(r: Result): bool", meta: "Result", doc: "Check if Err" },
  { name: "unwrap", sig: "fn unwrap(r: Result): T", meta: "Result", doc: "Extract Ok value" },
  { name: "unwrap_err", sig: "fn unwrap_err(r: Result): E", meta: "Result", doc: "Extract Err value" },
  // Utility
  { name: "exit", sig: "fn exit(code: int): void", meta: "Utility", doc: "Exit program" },
  { name: "assert", sig: "fn assert(cond: bool, msg: str): void", meta: "Utility", doc: "Assert condition" },
];

const URUS_KEYWORDS = [
  "fn", "let", "mut", "struct", "enum", "import",
  "if", "else", "while", "for", "in", "return", "break", "continue", "match",
  "true", "false", "Ok", "Err",
];

const URUS_TYPES = ["int", "float", "bool", "str", "void", "Result"];

// ─── Snippets ──────────────────────────────────────────────────
const URUS_SNIPPETS = [
  { name: "main", tabTrigger: "main", content: "fn main(): void {\n\t${1}\n}" },
  { name: "fn", tabTrigger: "fn", content: "fn ${1:name}(${2:params}): ${3:void} {\n\t${4}\n}" },
  { name: "fnr", tabTrigger: "fnr", content: "fn ${1:name}(${2:params}): ${3:int} {\n\t${4}\n\treturn ${5:value};\n}" },
  { name: "let", tabTrigger: "let", content: "let ${1:name}: ${2:int} = ${3:value};" },
  { name: "letm", tabTrigger: "letm", content: "let mut ${1:name}: ${2:int} = ${3:value};" },
  { name: "lets", tabTrigger: "lets", content: 'let ${1:name}: str = "${2:value}";' },
  { name: "leta", tabTrigger: "leta", content: "let ${1:name}: [${2:int}] = [${3:values}];" },
  { name: "if", tabTrigger: "if", content: "if ${1:condition} {\n\t${2}\n}" },
  { name: "ife", tabTrigger: "ife", content: "if ${1:condition} {\n\t${2}\n} else {\n\t${3}\n}" },
  { name: "while", tabTrigger: "while", content: "while ${1:condition} {\n\t${2}\n}" },
  { name: "for", tabTrigger: "for", content: "for ${1:i} in ${2:0}..${3:10} {\n\t${4}\n}" },
  { name: "fori", tabTrigger: "fori", content: "for ${1:i} in ${2:0}..=${3:10} {\n\t${4}\n}" },
  { name: "fore", tabTrigger: "fore", content: "for ${1:item} in ${2:array} {\n\t${3}\n}" },
  { name: "struct", tabTrigger: "struct", content: "struct ${1:Name} {\n\t${2:field}: ${3:int};\n}" },
  { name: "enum", tabTrigger: "enum", content: "enum ${1:Name} {\n\t${2:Variant1};\n\t${3:Variant2}(${4:val}: ${5:int});\n}" },
  { name: "match", tabTrigger: "match", content: "match ${1:value} {\n\t${2:Enum}.${3:Variant}(${4:x}) => {\n\t\t${5}\n\t}\n}" },
  { name: "import", tabTrigger: "import", content: 'import "${1:module}.urus";' },
  { name: "print", tabTrigger: "print", content: "print(${1:value});" },
  { name: "printf", tabTrigger: "printf", content: 'print(f"${1:text} {${2:expr}}");' },
  { name: "fnresult", tabTrigger: "fnresult", content: "fn ${1:name}(${2:params}): Result<${3:int}, ${4:str}> {\n\tif ${5:condition} {\n\t\treturn Ok(${6:value});\n\t}\n\treturn Err(${7:\"error\"});\n}" },
  { name: "ok", tabTrigger: "ok", content: "Ok(${1:value})" },
  { name: "err", tabTrigger: "err", content: "Err(${1:message})" },
  { name: "isok", tabTrigger: "isok", content: "if is_ok(${1:result}) {\n\tlet ${2:val}: ${3:int} = unwrap(${1:result});\n\t${4}\n} else {\n\tlet ${5:e}: ${6:str} = unwrap_err(${1:result});\n}" },
  { name: "push", tabTrigger: "push", content: "push(${1:array}, ${2:value});" },
  { name: "tostr", tabTrigger: "tostr", content: "to_str(${1:value})" },
  { name: "toint", tabTrigger: "toint", content: "to_int(${1:value})" },
  { name: "readf", tabTrigger: "readf", content: 'let ${1:content}: str = read_file("${2:path}");' },
  { name: "writef", tabTrigger: "writef", content: 'write_file("${1:path}", ${2:content});' },
  { name: "assert", tabTrigger: "assert", content: 'assert(${1:condition}, "${2:message}");' },
];

// ─── Ace Mode Definition ───────────────────────────────────────
function defineUrusMode() {
  ace.define(
    "ace/mode/urus_highlight_rules",
    [
      "require", "exports", "module",
      "ace/lib/oop", "ace/mode/text_highlight_rules",
    ],
    function (require, exports) {
      const oop = require("ace/lib/oop");
      const TextHighlightRules =
        require("ace/mode/text_highlight_rules").TextHighlightRules;

      const UrusHighlightRules = function () {
        const keywords =
          "if|else|while|for|in|return|break|continue|match|fn|let|mut|struct|enum|import";
        const resultKw = "Ok|Err";
        const types = "int|float|bool|str|void|Result";
        const constants = "true|false";
        const builtins =
          "print|input|read_file|write_file|append_file|" +
          "len|push|pop|" +
          "str_len|str_upper|str_lower|str_trim|str_contains|str_find|" +
          "str_slice|str_replace|str_starts_with|str_ends_with|str_split|char_at|" +
          "to_str|to_int|to_float|" +
          "abs|fabs|sqrt|pow|min|max|fmin|fmax|" +
          "is_ok|is_err|unwrap|unwrap_err|" +
          "exit|assert";

        this.$rules = {
          start: [
            // Comments
            { token: "comment.block", regex: /\/\*/, next: "block_comment" },
            { token: "comment.line", regex: /\/\/.*$/ },

            // F-strings
            { token: "string.interpolated", regex: /f"/, next: "fstring" },

            // Regular strings
            { token: "string.quoted", regex: /"/, next: "string" },

            // Numbers
            { token: "constant.numeric.float", regex: /\b\d+\.\d+\b/ },
            { token: "constant.numeric.integer", regex: /\b\d+\b/ },

            // Import path
            {
              token: ["keyword.control", "text", "string.import"],
              regex: /(import)(\s+)("[^"]*")/,
            },

            // Function declaration
            {
              token: ["keyword.declaration", "text", "entity.name.function"],
              regex: /(fn)(\s+)([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/,
            },

            // Struct declaration
            {
              token: ["keyword.declaration", "text", "entity.name.type"],
              regex: /(struct)(\s+)([A-Z][a-zA-Z0-9_]*)/,
            },

            // Enum declaration
            {
              token: ["keyword.declaration", "text", "entity.name.type"],
              regex: /(enum)(\s+)([A-Z][a-zA-Z0-9_]*)/,
            },

            // Let mut variable
            {
              token: ["keyword.declaration", "text", "storage.modifier", "text", "variable.declaration"],
              regex: /(let)(\s+)(mut)(\s+)([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*:)/,
            },

            // Let variable
            {
              token: ["keyword.declaration", "text", "variable.declaration"],
              regex: /(let)(\s+)([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*:)/,
            },

            // Enum variant: EnumName.Variant
            {
              token: ["entity.name.type", "punctuation", "variable.enum-member"],
              regex: /([A-Z][a-zA-Z0-9_]*)(\.)([A-Z][a-zA-Z0-9_]*)/,
            },

            // Result type: Result<T, E>
            {
              token: ["support.type", "punctuation.generic"],
              regex: /(Result)(<)/,
              next: "generic_type",
            },

            // Array type: [T]
            {
              token: ["punctuation.array-type", "storage.type", "punctuation.array-type"],
              regex: /(\[)(int|float|bool|str)(\])/,
            },

            // Keywords
            { token: "keyword.control", regex: new RegExp(`\\b(${keywords})\\b`) },

            // Ok / Err
            { token: "support.type.result", regex: new RegExp(`\\b(${resultKw})\\b`) },

            // Types
            { token: "storage.type", regex: new RegExp(`\\b(${types})\\b`) },

            // Constants
            { token: "constant.language", regex: new RegExp(`\\b(${constants})\\b`) },

            // Built-in function calls
            {
              token: "support.function.builtin",
              regex: new RegExp(`\\b(${builtins})(?=\\s*\\()`),
            },

            // User function calls
            {
              token: "entity.name.function.call",
              regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/,
            },

            // Method call: obj.method()
            {
              token: ["punctuation", "entity.name.function.method"],
              regex: /(\.)([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/,
            },

            // Field access: obj.field
            {
              token: ["punctuation", "variable.property"],
              regex: /(\.)([a-zA-Z_][a-zA-Z0-9_]*)\b/,
            },

            // Operators
            { token: "keyword.operator.arrow", regex: /=>/ },
            { token: "keyword.operator.range", regex: /\.\.=?/ },
            { token: "keyword.operator.comparison", regex: /==|!=|<=|>=|<|>/ },
            { token: "keyword.operator.logical", regex: /&&|\|\||!(?!=)/ },
            { token: "keyword.operator.assignment", regex: /\+=|-=|\*=|\/=|=(?!=|>)/ },
            { token: "keyword.operator.arithmetic", regex: /[+\-*/%]/ },

            // Punctuation
            { token: "paren.lparen", regex: /[(\[{]/ },
            { token: "paren.rparen", regex: /[)\]}]/ },
            { token: "punctuation.separator", regex: /[;,:]/ },
          ],

          // Block comments (with nesting)
          block_comment: [
            { token: "comment.block", regex: /\*\//, next: "start" },
            { defaultToken: "comment.block" },
          ],

          // Regular strings
          string: [
            { token: "constant.character.escape", regex: /\\[\\\"nrt0]/ },
            { token: "invalid.escape", regex: /\\./ },
            { token: "string.quoted", regex: /"/, next: "start" },
            { defaultToken: "string.quoted" },
          ],

          // F-strings with interpolation
          fstring: [
            {
              token: "punctuation.interpolation.begin",
              regex: /\{/,
              next: "fstring_expr",
            },
            { token: "constant.character.escape", regex: /\\[\\\"nrt0]/ },
            { token: "string.interpolated", regex: /"/, next: "start" },
            { defaultToken: "string.interpolated" },
          ],

          // Expression inside f-string {}
          fstring_expr: [
            { token: "punctuation.interpolation.end", regex: /\}/, next: "fstring" },
            { token: "constant.numeric.float", regex: /\b\d+\.\d+\b/ },
            { token: "constant.numeric.integer", regex: /\b\d+\b/ },
            { token: "string.quoted", regex: /"/, next: "fstring_expr_string" },
            {
              token: "support.function.builtin",
              regex: new RegExp(`\\b(${builtins})(?=\\s*\\()`),
            },
            {
              token: "entity.name.function.call",
              regex: /\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/,
            },
            { token: "constant.language", regex: /\b(true|false)\b/ },
            { token: "keyword.operator", regex: /[+\-*/%=<>!&|]+/ },
            { token: "variable", regex: /\b[a-zA-Z_][a-zA-Z0-9_]*\b/ },
          ],

          // String inside f-string expression
          fstring_expr_string: [
            { token: "constant.character.escape", regex: /\\./ },
            { token: "string.quoted", regex: /"/, next: "fstring_expr" },
            { defaultToken: "string.quoted" },
          ],

          // Generic type parameters: Result<T, E>
          generic_type: [
            { token: "storage.type", regex: /\b(int|float|bool|str|void)\b/ },
            { token: "entity.name.type", regex: /\b[A-Z][a-zA-Z0-9_]*\b/ },
            { token: "punctuation.separator", regex: /,/ },
            { token: "punctuation.generic", regex: />/, next: "start" },
            { defaultToken: "text" },
          ],
        };

        this.normalizeRules();
      };

      oop.inherits(UrusHighlightRules, TextHighlightRules);
      exports.UrusHighlightRules = UrusHighlightRules;
    }
  );

  // ─── Folding Rules ─────────────────────────────────────────
  ace.define(
    "ace/mode/urus_folding",
    ["require", "exports", "module", "ace/lib/oop", "ace/mode/folding/cstyle"],
    function (require, exports) {
      const oop = require("ace/lib/oop");
      const CStyleFolding = require("ace/mode/folding/cstyle").FoldMode;

      const UrusFolding = function () {};
      oop.inherits(UrusFolding, CStyleFolding);
      exports.FoldMode = UrusFolding;
    }
  );

  // ─── Mode ──────────────────────────────────────────────────
  ace.define(
    "ace/mode/urus",
    [
      "require", "exports", "module",
      "ace/lib/oop", "ace/mode/text",
      "ace/mode/urus_highlight_rules",
      "ace/mode/urus_folding",
      "ace/mode/matching_brace_outdent",
      "ace/mode/behaviour/cstyle",
    ],
    function (require, exports) {
      const oop = require("ace/lib/oop");
      const TextMode = require("ace/mode/text").Mode;
      const UrusHighlightRules =
        require("ace/mode/urus_highlight_rules").UrusHighlightRules;
      const UrusFolding = require("ace/mode/urus_folding").FoldMode;
      const MatchingBraceOutdent =
        require("ace/mode/matching_brace_outdent").MatchingBraceOutdent;
      const CstyleBehaviour =
        require("ace/mode/behaviour/cstyle").CstyleBehaviour;

      const Mode = function () {
        this.HighlightRules = UrusHighlightRules;
        this.foldingRules = new UrusFolding();
        this.$outdent = new MatchingBraceOutdent();
        this.$behaviour = new CstyleBehaviour();
        this.lineCommentStart = "//";
        this.blockComment = { start: "/*", end: "*/" };
      };

      oop.inherits(Mode, TextMode);

      Mode.prototype.checkOutdent = function (state, line, input) {
        return this.$outdent.checkOutdent(line, input);
      };

      Mode.prototype.autoOutdent = function (state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
      };

      Mode.prototype.getNextLineIndent = function (state, line, tab) {
        let indent = this.$getIndent(line);
        if (/\{\s*$/.test(line)) {
          indent += tab;
        }
        return indent;
      };

      exports.Mode = Mode;
    }
  );
}

// ─── Auto-Complete ─────────────────────────────────────────────
function createUrusCompleter() {
  // Pre-build completion items for performance
  const builtinCompletions = URUS_BUILTINS.map(function (fn) {
    return {
      caption: fn.name,
      value: fn.name,
      meta: fn.meta,
      score: 900,
      docHTML: "<b>" + fn.sig + "</b><br>" + fn.doc,
    };
  });

  const keywordCompletions = URUS_KEYWORDS.map(function (kw) {
    return {
      caption: kw,
      value: kw,
      meta: "keyword",
      score: 800,
    };
  });

  const typeCompletions = URUS_TYPES.map(function (t) {
    return {
      caption: t,
      value: t,
      meta: "type",
      score: 850,
    };
  });

  const allCompletions = builtinCompletions
    .concat(keywordCompletions)
    .concat(typeCompletions);

  return {
    getCompletions: function (editor, session, pos, prefix, callback) {
      if (!prefix || prefix.length === 0) {
        callback(null, []);
        return;
      }

      // Check context — after ':' suggest types only
      var line = session.getLine(pos.row);
      var beforeCursor = line.substring(0, pos.column - prefix.length);
      if (/:\s*$/.test(beforeCursor)) {
        callback(null, typeCompletions);
        return;
      }

      // After '.' — try to find enum variants
      var dotMatch = beforeCursor.match(/\b([A-Z][a-zA-Z0-9_]*)\.\s*$/);
      if (dotMatch) {
        var enumName = dotMatch[1];
        var text = session.getValue();
        var enumRegex = new RegExp(
          "\\benum\\s+" + enumName + "\\s*\\{([^}]*?)\\}",
          "s"
        );
        var enumMatch = text.match(enumRegex);
        if (enumMatch) {
          var variants = [];
          var varRe = /\b([A-Z][a-zA-Z0-9_]*)(?:\s*\([^)]*\))?\s*;/g;
          var vm;
          while ((vm = varRe.exec(enumMatch[1])) !== null) {
            variants.push({
              caption: vm[1],
              value: vm[1],
              meta: enumName + " variant",
              score: 1000,
            });
          }
          callback(null, variants);
          return;
        }
      }

      // Default — all completions filtered by prefix
      callback(null, allCompletions);
    },
    getDocTooltip: function (item) {
      if (item.docHTML) {
        item.docHTML = item.docHTML;
      }
    },
  };
}

// ─── Register Snippets ─────────────────────────────────────────
function registerUrusSnippets() {
  try {
    var snippetManager = ace.require("ace/snippets").snippetManager;
    if (snippetManager) {
      snippetManager.register(URUS_SNIPPETS, "urus");
    }
  } catch (e) {
    // Snippets module may not be available
  }
}

// ─── Register Auto-Complete ────────────────────────────────────
var urusCompleter = null;

function registerUrusCompleter() {
  try {
    var langTools = ace.require("ace/ext/language_tools");
    if (langTools) {
      urusCompleter = createUrusCompleter();
      langTools.addCompleter(urusCompleter);
    }
  } catch (e) {
    // language_tools may not be available
  }
}

function unregisterUrusCompleter() {
  try {
    if (urusCompleter) {
      var langTools = ace.require("ace/ext/language_tools");
      if (langTools && langTools.setCompleters) {
        var completers = langTools.textCompleter
          ? [langTools.textCompleter, langTools.keyWordCompleter, langTools.snippetCompleter]
          : [];
        langTools.setCompleters(completers);
      }
      urusCompleter = null;
    }
  } catch (e) {}
}

// ─── Acode Plugin Entry Point ──────────────────────────────────
if (typeof acode !== "undefined") {
  const plugin = {
    async init(baseUrl) {
      // 1. Define Ace mode (syntax, folding, indentation)
      defineUrusMode();

      // 2. Register mode with Acode
      const aceModes = acode.require("aceModes");
      if (aceModes && aceModes.addMode) {
        aceModes.addMode("urus", ["urus"], "URUS");
      }

      // 3. Register file icon
      const iconUrl = baseUrl + "icon.png";
      if (acode.addIcon) {
        acode.addIcon("urus", iconUrl);
      }

      // 4. Inject CSS for file icon in explorer
      const style = document.createElement("style");
      style.id = "urus-plugin-style";
      style.textContent =
        '[data-ext="urus"] .file-icon,' +
        ".file-icon.urus," +
        "span.icon.urus {" +
        "  background-image: url('" + iconUrl + "') !important;" +
        "  background-size: contain !important;" +
        "  background-repeat: no-repeat !important;" +
        "  background-position: center !important;" +
        "}";
      document.head.appendChild(style);

      // 5. Register snippets
      registerUrusSnippets();

      // 6. Register auto-complete
      registerUrusCompleter();
    },

    async destroy() {
      // Remove Ace mode
      try {
        const aceModes = acode.require("aceModes");
        if (aceModes && aceModes.removeMode) {
          aceModes.removeMode("urus");
        }
      } catch (e) {}

      // Remove snippets
      try {
        var snippetManager = ace.require("ace/snippets").snippetManager;
        if (snippetManager) {
          snippetManager.unregister(URUS_SNIPPETS, "urus");
        }
      } catch (e) {}

      // Remove auto-complete
      unregisterUrusCompleter();

      // Remove CSS
      var el = document.getElementById("urus-plugin-style");
      if (el) { el.remove(); }
    },
  };

  acode.setPluginInit(
    "acode.plugin.urus",
    async (baseUrl, $page, { cacheFileUrl }) => {
      await plugin.init(baseUrl);
    }
  );

  acode.setPluginUnmount("acode.plugin.urus", () => {
    plugin.destroy();
  });
}
