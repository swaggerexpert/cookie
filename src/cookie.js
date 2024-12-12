// copyright: Copyright (c) 2024 Lowell D. Thomas, all rights reserved<br>
//   license: BSD-2-Clause (https://opensource.org/licenses/BSD-2-Clause)<br>
//
// Generated by apg-js, Version 4.4.0 [apg-js](https://github.com/ldthomas/apg-js)
export default function grammar(){
  // ```
  // SUMMARY
  //      rules = 13
  //       udts = 0
  //    opcodes = 65
  //        ---   ABNF original opcodes
  //        ALT = 5
  //        CAT = 4
  //        REP = 4
  //        RNM = 13
  //        TLS = 18
  //        TBS = 9
  //        TRG = 12
  //        ---   SABNF superset opcodes
  //        UDT = 0
  //        AND = 0
  //        NOT = 0
  // characters = [0 - 127]
  // ```
  /* OBJECT IDENTIFIER (for internal parser use) */
  this.grammarObject = 'grammarObject';

  /* RULES */
  this.rules = [];
  this.rules[0] = { name: 'cookie-string', lower: 'cookie-string', index: 0, isBkr: false };
  this.rules[1] = { name: 'cookie-pair', lower: 'cookie-pair', index: 1, isBkr: false };
  this.rules[2] = { name: 'cookie-name', lower: 'cookie-name', index: 2, isBkr: false };
  this.rules[3] = { name: 'cookie-value', lower: 'cookie-value', index: 3, isBkr: false };
  this.rules[4] = { name: 'cookie-octet', lower: 'cookie-octet', index: 4, isBkr: false };
  this.rules[5] = { name: 'token', lower: 'token', index: 5, isBkr: false };
  this.rules[6] = { name: 'tchar', lower: 'tchar', index: 6, isBkr: false };
  this.rules[7] = { name: 'CHAR', lower: 'char', index: 7, isBkr: false };
  this.rules[8] = { name: 'CTL', lower: 'ctl', index: 8, isBkr: false };
  this.rules[9] = { name: 'separators', lower: 'separators', index: 9, isBkr: false };
  this.rules[10] = { name: 'SP', lower: 'sp', index: 10, isBkr: false };
  this.rules[11] = { name: 'HT', lower: 'ht', index: 11, isBkr: false };
  this.rules[12] = { name: 'DQUOTE', lower: 'dquote', index: 12, isBkr: false };

  /* UDTS */
  this.udts = [];

  /* OPCODES */
  /* cookie-string */
  this.rules[0].opcodes = [];
  this.rules[0].opcodes[0] = { type: 2, children: [1,2] };// CAT
  this.rules[0].opcodes[1] = { type: 4, index: 1 };// RNM(cookie-pair)
  this.rules[0].opcodes[2] = { type: 3, min: 0, max: Infinity };// REP
  this.rules[0].opcodes[3] = { type: 2, children: [4,5,6] };// CAT
  this.rules[0].opcodes[4] = { type: 7, string: [59] };// TLS
  this.rules[0].opcodes[5] = { type: 4, index: 10 };// RNM(SP)
  this.rules[0].opcodes[6] = { type: 4, index: 1 };// RNM(cookie-pair)

  /* cookie-pair */
  this.rules[1].opcodes = [];
  this.rules[1].opcodes[0] = { type: 2, children: [1,2,3] };// CAT
  this.rules[1].opcodes[1] = { type: 4, index: 2 };// RNM(cookie-name)
  this.rules[1].opcodes[2] = { type: 7, string: [61] };// TLS
  this.rules[1].opcodes[3] = { type: 4, index: 3 };// RNM(cookie-value)

  /* cookie-name */
  this.rules[2].opcodes = [];
  this.rules[2].opcodes[0] = { type: 4, index: 5 };// RNM(token)

  /* cookie-value */
  this.rules[3].opcodes = [];
  this.rules[3].opcodes[0] = { type: 1, children: [1,3] };// ALT
  this.rules[3].opcodes[1] = { type: 3, min: 0, max: Infinity };// REP
  this.rules[3].opcodes[2] = { type: 4, index: 4 };// RNM(cookie-octet)
  this.rules[3].opcodes[3] = { type: 2, children: [4,5,7] };// CAT
  this.rules[3].opcodes[4] = { type: 4, index: 12 };// RNM(DQUOTE)
  this.rules[3].opcodes[5] = { type: 3, min: 0, max: Infinity };// REP
  this.rules[3].opcodes[6] = { type: 4, index: 4 };// RNM(cookie-octet)
  this.rules[3].opcodes[7] = { type: 4, index: 12 };// RNM(DQUOTE)

  /* cookie-octet */
  this.rules[4].opcodes = [];
  this.rules[4].opcodes[0] = { type: 1, children: [1,2,3,4,5] };// ALT
  this.rules[4].opcodes[1] = { type: 6, string: [33] };// TBS
  this.rules[4].opcodes[2] = { type: 5, min: 35, max: 43 };// TRG
  this.rules[4].opcodes[3] = { type: 5, min: 45, max: 58 };// TRG
  this.rules[4].opcodes[4] = { type: 5, min: 60, max: 91 };// TRG
  this.rules[4].opcodes[5] = { type: 5, min: 93, max: 126 };// TRG

  /* token */
  this.rules[5].opcodes = [];
  this.rules[5].opcodes[0] = { type: 3, min: 1, max: Infinity };// REP
  this.rules[5].opcodes[1] = { type: 4, index: 6 };// RNM(tchar)

  /* tchar */
  this.rules[6].opcodes = [];
  this.rules[6].opcodes[0] = { type: 1, children: [1,2,3,4,5,6,7,8,9] };// ALT
  this.rules[6].opcodes[1] = { type: 6, string: [33] };// TBS
  this.rules[6].opcodes[2] = { type: 5, min: 35, max: 39 };// TRG
  this.rules[6].opcodes[3] = { type: 5, min: 42, max: 43 };// TRG
  this.rules[6].opcodes[4] = { type: 5, min: 45, max: 46 };// TRG
  this.rules[6].opcodes[5] = { type: 5, min: 48, max: 57 };// TRG
  this.rules[6].opcodes[6] = { type: 5, min: 65, max: 90 };// TRG
  this.rules[6].opcodes[7] = { type: 5, min: 94, max: 122 };// TRG
  this.rules[6].opcodes[8] = { type: 6, string: [124] };// TBS
  this.rules[6].opcodes[9] = { type: 6, string: [126] };// TBS

  /* CHAR */
  this.rules[7].opcodes = [];
  this.rules[7].opcodes[0] = { type: 5, min: 1, max: 127 };// TRG

  /* CTL */
  this.rules[8].opcodes = [];
  this.rules[8].opcodes[0] = { type: 1, children: [1,2] };// ALT
  this.rules[8].opcodes[1] = { type: 5, min: 0, max: 31 };// TRG
  this.rules[8].opcodes[2] = { type: 6, string: [127] };// TBS

  /* separators */
  this.rules[9].opcodes = [];
  this.rules[9].opcodes[0] = { type: 1, children: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19] };// ALT
  this.rules[9].opcodes[1] = { type: 7, string: [40] };// TLS
  this.rules[9].opcodes[2] = { type: 7, string: [41] };// TLS
  this.rules[9].opcodes[3] = { type: 7, string: [60] };// TLS
  this.rules[9].opcodes[4] = { type: 7, string: [62] };// TLS
  this.rules[9].opcodes[5] = { type: 7, string: [64] };// TLS
  this.rules[9].opcodes[6] = { type: 7, string: [44] };// TLS
  this.rules[9].opcodes[7] = { type: 7, string: [59] };// TLS
  this.rules[9].opcodes[8] = { type: 7, string: [58] };// TLS
  this.rules[9].opcodes[9] = { type: 7, string: [92] };// TLS
  this.rules[9].opcodes[10] = { type: 6, string: [34] };// TBS
  this.rules[9].opcodes[11] = { type: 7, string: [47] };// TLS
  this.rules[9].opcodes[12] = { type: 7, string: [91] };// TLS
  this.rules[9].opcodes[13] = { type: 7, string: [93] };// TLS
  this.rules[9].opcodes[14] = { type: 7, string: [63] };// TLS
  this.rules[9].opcodes[15] = { type: 7, string: [61] };// TLS
  this.rules[9].opcodes[16] = { type: 7, string: [123] };// TLS
  this.rules[9].opcodes[17] = { type: 7, string: [125] };// TLS
  this.rules[9].opcodes[18] = { type: 4, index: 10 };// RNM(SP)
  this.rules[9].opcodes[19] = { type: 4, index: 11 };// RNM(HT)

  /* SP */
  this.rules[10].opcodes = [];
  this.rules[10].opcodes[0] = { type: 6, string: [32] };// TBS

  /* HT */
  this.rules[11].opcodes = [];
  this.rules[11].opcodes[0] = { type: 6, string: [9] };// TBS

  /* DQUOTE */
  this.rules[12].opcodes = [];
  this.rules[12].opcodes[0] = { type: 6, string: [34] };// TBS

  // The `toString()` function will display the original grammar file(s) that produced these opcodes.
  this.toString = function toString(){
    let str = "";
    str += "; https://datatracker.ietf.org/doc/html/rfc6265#section-4.2.1\n";
    str += "cookie-string     = cookie-pair *( \";\" SP cookie-pair )\n";
    str += "cookie-pair       = cookie-name \"=\" cookie-value\n";
    str += "cookie-name       = token\n";
    str += "cookie-value      = *cookie-octet / ( DQUOTE *cookie-octet DQUOTE )\n";
    str += "cookie-octet      = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E\n";
    str += "                       ; US-ASCII characters excluding CTLs,\n";
    str += "                       ; whitespace DQUOTE, comma, semicolon,\n";
    str += "                       ; and backslash\n";
    str += "\n";
    str += "; https://datatracker.ietf.org/doc/html/rfc2616#section-2.2\n";
    str += "token          = 1*(tchar)\n";
    str += "tchar          = %x21 / %x23-27 / %x2A-2B / %x2D-2E / %x30-39 / %x41-5A / %x5E-7A / %x7C / %x7E\n";
    str += "                ; Any CHAR except CTLs and separators\n";
    str += "CHAR           = %x01-7F ; any US-ASCII character (octets 0 - 127)\n";
    str += "CTL            = %x00-1F / %x7F ; any US-ASCII control character\n";
    str += "separators     = \"(\" / \")\" / \"<\" / \">\" / \"@\" / \",\" / \";\" / \":\" / \"\\\" / %x22 / \"/\" / \"[\" / \"]\" / \"?\" / \"=\" / \"{\" / \"}\" / SP / HT\n";
    str += "SP             = %x20 ; US-ASCII SP, space (32)\n";
    str += "HT             = %x09 ; US-ASCII HT, horizontal-tab (9)\n";
    str += "\n";
    str += "; https://datatracker.ietf.org/doc/html/rfc5234#appendix-B.1\n";
    str += "DQUOTE         =  %x22 ; \" (Double Quote)\n";
    return str;
  }
}
