// copyright: Copyright (c) 2024 Lowell D. Thomas, all rights reserved<br>
//   license: BSD-2-Clause (https://opensource.org/licenses/BSD-2-Clause)<br>
//
// Generated by apg-js, Version 4.4.0 [apg-js](https://github.com/ldthomas/apg-js)
export default function grammar(){
  // ```
  // SUMMARY
  //      rules = 30
  //       udts = 0
  //    opcodes = 139
  //        ---   ABNF original opcodes
  //        ALT = 12
  //        CAT = 12
  //        REP = 13
  //        RNM = 41
  //        TLS = 35
  //        TBS = 10
  //        TRG = 16
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
  this.rules[0] = { name: 'lenient-cookie-string', lower: 'lenient-cookie-string', index: 0, isBkr: false };
  this.rules[1] = { name: 'lenient-cookie-entry', lower: 'lenient-cookie-entry', index: 1, isBkr: false };
  this.rules[2] = { name: 'lenient-cookie-pair', lower: 'lenient-cookie-pair', index: 2, isBkr: false };
  this.rules[3] = { name: 'lenient-cookie-pair-invalid', lower: 'lenient-cookie-pair-invalid', index: 3, isBkr: false };
  this.rules[4] = { name: 'lenient-cookie-name', lower: 'lenient-cookie-name', index: 4, isBkr: false };
  this.rules[5] = { name: 'lenient-cookie-value', lower: 'lenient-cookie-value', index: 5, isBkr: false };
  this.rules[6] = { name: 'lenient-quoted-value', lower: 'lenient-quoted-value', index: 6, isBkr: false };
  this.rules[7] = { name: 'lenient-quoted-char', lower: 'lenient-quoted-char', index: 7, isBkr: false };
  this.rules[8] = { name: 'lenient-cookie-octet', lower: 'lenient-cookie-octet', index: 8, isBkr: false };
  this.rules[9] = { name: 'cookie-string', lower: 'cookie-string', index: 9, isBkr: false };
  this.rules[10] = { name: 'cookie-pair', lower: 'cookie-pair', index: 10, isBkr: false };
  this.rules[11] = { name: 'cookie-name', lower: 'cookie-name', index: 11, isBkr: false };
  this.rules[12] = { name: 'cookie-value', lower: 'cookie-value', index: 12, isBkr: false };
  this.rules[13] = { name: 'cookie-octet', lower: 'cookie-octet', index: 13, isBkr: false };
  this.rules[14] = { name: 'OWS', lower: 'ows', index: 14, isBkr: false };
  this.rules[15] = { name: 'token', lower: 'token', index: 15, isBkr: false };
  this.rules[16] = { name: 'tchar', lower: 'tchar', index: 16, isBkr: false };
  this.rules[17] = { name: 'CHAR', lower: 'char', index: 17, isBkr: false };
  this.rules[18] = { name: 'CTL', lower: 'ctl', index: 18, isBkr: false };
  this.rules[19] = { name: 'separators', lower: 'separators', index: 19, isBkr: false };
  this.rules[20] = { name: 'SP', lower: 'sp', index: 20, isBkr: false };
  this.rules[21] = { name: 'HT', lower: 'ht', index: 21, isBkr: false };
  this.rules[22] = { name: 'ALPHA', lower: 'alpha', index: 22, isBkr: false };
  this.rules[23] = { name: 'DIGIT', lower: 'digit', index: 23, isBkr: false };
  this.rules[24] = { name: 'DQUOTE', lower: 'dquote', index: 24, isBkr: false };
  this.rules[25] = { name: 'WSP', lower: 'wsp', index: 25, isBkr: false };
  this.rules[26] = { name: 'HTAB', lower: 'htab', index: 26, isBkr: false };
  this.rules[27] = { name: 'CRLF', lower: 'crlf', index: 27, isBkr: false };
  this.rules[28] = { name: 'CR', lower: 'cr', index: 28, isBkr: false };
  this.rules[29] = { name: 'LF', lower: 'lf', index: 29, isBkr: false };

  /* UDTS */
  this.udts = [];

  /* OPCODES */
  /* lenient-cookie-string */
  this.rules[0].opcodes = [];
  this.rules[0].opcodes[0] = { type: 2, children: [1,2] };// CAT
  this.rules[0].opcodes[1] = { type: 4, index: 1 };// RNM(lenient-cookie-entry)
  this.rules[0].opcodes[2] = { type: 3, min: 0, max: Infinity };// REP
  this.rules[0].opcodes[3] = { type: 2, children: [4,5,6] };// CAT
  this.rules[0].opcodes[4] = { type: 7, string: [59] };// TLS
  this.rules[0].opcodes[5] = { type: 4, index: 14 };// RNM(OWS)
  this.rules[0].opcodes[6] = { type: 4, index: 1 };// RNM(lenient-cookie-entry)

  /* lenient-cookie-entry */
  this.rules[1].opcodes = [];
  this.rules[1].opcodes[0] = { type: 1, children: [1,2] };// ALT
  this.rules[1].opcodes[1] = { type: 4, index: 2 };// RNM(lenient-cookie-pair)
  this.rules[1].opcodes[2] = { type: 4, index: 3 };// RNM(lenient-cookie-pair-invalid)

  /* lenient-cookie-pair */
  this.rules[2].opcodes = [];
  this.rules[2].opcodes[0] = { type: 2, children: [1,2,3,4,5,6,7] };// CAT
  this.rules[2].opcodes[1] = { type: 4, index: 14 };// RNM(OWS)
  this.rules[2].opcodes[2] = { type: 4, index: 4 };// RNM(lenient-cookie-name)
  this.rules[2].opcodes[3] = { type: 4, index: 14 };// RNM(OWS)
  this.rules[2].opcodes[4] = { type: 7, string: [61] };// TLS
  this.rules[2].opcodes[5] = { type: 4, index: 14 };// RNM(OWS)
  this.rules[2].opcodes[6] = { type: 4, index: 5 };// RNM(lenient-cookie-value)
  this.rules[2].opcodes[7] = { type: 4, index: 14 };// RNM(OWS)

  /* lenient-cookie-pair-invalid */
  this.rules[3].opcodes = [];
  this.rules[3].opcodes[0] = { type: 2, children: [1,2,4] };// CAT
  this.rules[3].opcodes[1] = { type: 4, index: 14 };// RNM(OWS)
  this.rules[3].opcodes[2] = { type: 3, min: 1, max: Infinity };// REP
  this.rules[3].opcodes[3] = { type: 4, index: 16 };// RNM(tchar)
  this.rules[3].opcodes[4] = { type: 4, index: 14 };// RNM(OWS)

  /* lenient-cookie-name */
  this.rules[4].opcodes = [];
  this.rules[4].opcodes[0] = { type: 3, min: 1, max: Infinity };// REP
  this.rules[4].opcodes[1] = { type: 1, children: [2,3,4] };// ALT
  this.rules[4].opcodes[2] = { type: 5, min: 33, max: 58 };// TRG
  this.rules[4].opcodes[3] = { type: 6, string: [60] };// TBS
  this.rules[4].opcodes[4] = { type: 5, min: 62, max: 126 };// TRG

  /* lenient-cookie-value */
  this.rules[5].opcodes = [];
  this.rules[5].opcodes[0] = { type: 1, children: [1,6] };// ALT
  this.rules[5].opcodes[1] = { type: 2, children: [2,3] };// CAT
  this.rules[5].opcodes[2] = { type: 4, index: 6 };// RNM(lenient-quoted-value)
  this.rules[5].opcodes[3] = { type: 3, min: 0, max: 1 };// REP
  this.rules[5].opcodes[4] = { type: 3, min: 0, max: Infinity };// REP
  this.rules[5].opcodes[5] = { type: 4, index: 8 };// RNM(lenient-cookie-octet)
  this.rules[5].opcodes[6] = { type: 3, min: 0, max: Infinity };// REP
  this.rules[5].opcodes[7] = { type: 4, index: 8 };// RNM(lenient-cookie-octet)

  /* lenient-quoted-value */
  this.rules[6].opcodes = [];
  this.rules[6].opcodes[0] = { type: 2, children: [1,2,4] };// CAT
  this.rules[6].opcodes[1] = { type: 4, index: 24 };// RNM(DQUOTE)
  this.rules[6].opcodes[2] = { type: 3, min: 0, max: Infinity };// REP
  this.rules[6].opcodes[3] = { type: 4, index: 7 };// RNM(lenient-quoted-char)
  this.rules[6].opcodes[4] = { type: 4, index: 24 };// RNM(DQUOTE)

  /* lenient-quoted-char */
  this.rules[7].opcodes = [];
  this.rules[7].opcodes[0] = { type: 1, children: [1,2] };// ALT
  this.rules[7].opcodes[1] = { type: 5, min: 32, max: 33 };// TRG
  this.rules[7].opcodes[2] = { type: 5, min: 35, max: 126 };// TRG

  /* lenient-cookie-octet */
  this.rules[8].opcodes = [];
  this.rules[8].opcodes[0] = { type: 1, children: [1,2,3] };// ALT
  this.rules[8].opcodes[1] = { type: 5, min: 33, max: 43 };// TRG
  this.rules[8].opcodes[2] = { type: 5, min: 45, max: 58 };// TRG
  this.rules[8].opcodes[3] = { type: 5, min: 60, max: 126 };// TRG

  /* cookie-string */
  this.rules[9].opcodes = [];
  this.rules[9].opcodes[0] = { type: 2, children: [1,2] };// CAT
  this.rules[9].opcodes[1] = { type: 4, index: 10 };// RNM(cookie-pair)
  this.rules[9].opcodes[2] = { type: 3, min: 0, max: Infinity };// REP
  this.rules[9].opcodes[3] = { type: 2, children: [4,5,6] };// CAT
  this.rules[9].opcodes[4] = { type: 7, string: [59] };// TLS
  this.rules[9].opcodes[5] = { type: 4, index: 20 };// RNM(SP)
  this.rules[9].opcodes[6] = { type: 4, index: 10 };// RNM(cookie-pair)

  /* cookie-pair */
  this.rules[10].opcodes = [];
  this.rules[10].opcodes[0] = { type: 2, children: [1,2,3] };// CAT
  this.rules[10].opcodes[1] = { type: 4, index: 11 };// RNM(cookie-name)
  this.rules[10].opcodes[2] = { type: 7, string: [61] };// TLS
  this.rules[10].opcodes[3] = { type: 4, index: 12 };// RNM(cookie-value)

  /* cookie-name */
  this.rules[11].opcodes = [];
  this.rules[11].opcodes[0] = { type: 4, index: 15 };// RNM(token)

  /* cookie-value */
  this.rules[12].opcodes = [];
  this.rules[12].opcodes[0] = { type: 1, children: [1,6] };// ALT
  this.rules[12].opcodes[1] = { type: 2, children: [2,3,5] };// CAT
  this.rules[12].opcodes[2] = { type: 4, index: 24 };// RNM(DQUOTE)
  this.rules[12].opcodes[3] = { type: 3, min: 0, max: Infinity };// REP
  this.rules[12].opcodes[4] = { type: 4, index: 13 };// RNM(cookie-octet)
  this.rules[12].opcodes[5] = { type: 4, index: 24 };// RNM(DQUOTE)
  this.rules[12].opcodes[6] = { type: 3, min: 0, max: Infinity };// REP
  this.rules[12].opcodes[7] = { type: 4, index: 13 };// RNM(cookie-octet)

  /* cookie-octet */
  this.rules[13].opcodes = [];
  this.rules[13].opcodes[0] = { type: 1, children: [1,2,3,4,5] };// ALT
  this.rules[13].opcodes[1] = { type: 6, string: [33] };// TBS
  this.rules[13].opcodes[2] = { type: 5, min: 35, max: 43 };// TRG
  this.rules[13].opcodes[3] = { type: 5, min: 45, max: 58 };// TRG
  this.rules[13].opcodes[4] = { type: 5, min: 60, max: 91 };// TRG
  this.rules[13].opcodes[5] = { type: 5, min: 93, max: 126 };// TRG

  /* OWS */
  this.rules[14].opcodes = [];
  this.rules[14].opcodes[0] = { type: 3, min: 0, max: Infinity };// REP
  this.rules[14].opcodes[1] = { type: 2, children: [2,4] };// CAT
  this.rules[14].opcodes[2] = { type: 3, min: 0, max: 1 };// REP
  this.rules[14].opcodes[3] = { type: 4, index: 27 };// RNM(CRLF)
  this.rules[14].opcodes[4] = { type: 4, index: 25 };// RNM(WSP)

  /* token */
  this.rules[15].opcodes = [];
  this.rules[15].opcodes[0] = { type: 3, min: 1, max: Infinity };// REP
  this.rules[15].opcodes[1] = { type: 4, index: 16 };// RNM(tchar)

  /* tchar */
  this.rules[16].opcodes = [];
  this.rules[16].opcodes[0] = { type: 1, children: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17] };// ALT
  this.rules[16].opcodes[1] = { type: 7, string: [33] };// TLS
  this.rules[16].opcodes[2] = { type: 7, string: [35] };// TLS
  this.rules[16].opcodes[3] = { type: 7, string: [36] };// TLS
  this.rules[16].opcodes[4] = { type: 7, string: [37] };// TLS
  this.rules[16].opcodes[5] = { type: 7, string: [38] };// TLS
  this.rules[16].opcodes[6] = { type: 7, string: [39] };// TLS
  this.rules[16].opcodes[7] = { type: 7, string: [42] };// TLS
  this.rules[16].opcodes[8] = { type: 7, string: [43] };// TLS
  this.rules[16].opcodes[9] = { type: 7, string: [45] };// TLS
  this.rules[16].opcodes[10] = { type: 7, string: [46] };// TLS
  this.rules[16].opcodes[11] = { type: 7, string: [94] };// TLS
  this.rules[16].opcodes[12] = { type: 7, string: [95] };// TLS
  this.rules[16].opcodes[13] = { type: 7, string: [96] };// TLS
  this.rules[16].opcodes[14] = { type: 7, string: [124] };// TLS
  this.rules[16].opcodes[15] = { type: 7, string: [126] };// TLS
  this.rules[16].opcodes[16] = { type: 4, index: 23 };// RNM(DIGIT)
  this.rules[16].opcodes[17] = { type: 4, index: 22 };// RNM(ALPHA)

  /* CHAR */
  this.rules[17].opcodes = [];
  this.rules[17].opcodes[0] = { type: 5, min: 1, max: 127 };// TRG

  /* CTL */
  this.rules[18].opcodes = [];
  this.rules[18].opcodes[0] = { type: 1, children: [1,2] };// ALT
  this.rules[18].opcodes[1] = { type: 5, min: 0, max: 31 };// TRG
  this.rules[18].opcodes[2] = { type: 6, string: [127] };// TBS

  /* separators */
  this.rules[19].opcodes = [];
  this.rules[19].opcodes[0] = { type: 1, children: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19] };// ALT
  this.rules[19].opcodes[1] = { type: 7, string: [40] };// TLS
  this.rules[19].opcodes[2] = { type: 7, string: [41] };// TLS
  this.rules[19].opcodes[3] = { type: 7, string: [60] };// TLS
  this.rules[19].opcodes[4] = { type: 7, string: [62] };// TLS
  this.rules[19].opcodes[5] = { type: 7, string: [64] };// TLS
  this.rules[19].opcodes[6] = { type: 7, string: [44] };// TLS
  this.rules[19].opcodes[7] = { type: 7, string: [59] };// TLS
  this.rules[19].opcodes[8] = { type: 7, string: [58] };// TLS
  this.rules[19].opcodes[9] = { type: 7, string: [92] };// TLS
  this.rules[19].opcodes[10] = { type: 6, string: [34] };// TBS
  this.rules[19].opcodes[11] = { type: 7, string: [47] };// TLS
  this.rules[19].opcodes[12] = { type: 7, string: [91] };// TLS
  this.rules[19].opcodes[13] = { type: 7, string: [93] };// TLS
  this.rules[19].opcodes[14] = { type: 7, string: [63] };// TLS
  this.rules[19].opcodes[15] = { type: 7, string: [61] };// TLS
  this.rules[19].opcodes[16] = { type: 7, string: [123] };// TLS
  this.rules[19].opcodes[17] = { type: 7, string: [125] };// TLS
  this.rules[19].opcodes[18] = { type: 4, index: 20 };// RNM(SP)
  this.rules[19].opcodes[19] = { type: 4, index: 21 };// RNM(HT)

  /* SP */
  this.rules[20].opcodes = [];
  this.rules[20].opcodes[0] = { type: 6, string: [32] };// TBS

  /* HT */
  this.rules[21].opcodes = [];
  this.rules[21].opcodes[0] = { type: 6, string: [9] };// TBS

  /* ALPHA */
  this.rules[22].opcodes = [];
  this.rules[22].opcodes[0] = { type: 1, children: [1,2] };// ALT
  this.rules[22].opcodes[1] = { type: 5, min: 65, max: 90 };// TRG
  this.rules[22].opcodes[2] = { type: 5, min: 97, max: 122 };// TRG

  /* DIGIT */
  this.rules[23].opcodes = [];
  this.rules[23].opcodes[0] = { type: 5, min: 48, max: 57 };// TRG

  /* DQUOTE */
  this.rules[24].opcodes = [];
  this.rules[24].opcodes[0] = { type: 6, string: [34] };// TBS

  /* WSP */
  this.rules[25].opcodes = [];
  this.rules[25].opcodes[0] = { type: 1, children: [1,2] };// ALT
  this.rules[25].opcodes[1] = { type: 4, index: 20 };// RNM(SP)
  this.rules[25].opcodes[2] = { type: 4, index: 26 };// RNM(HTAB)

  /* HTAB */
  this.rules[26].opcodes = [];
  this.rules[26].opcodes[0] = { type: 6, string: [9] };// TBS

  /* CRLF */
  this.rules[27].opcodes = [];
  this.rules[27].opcodes[0] = { type: 2, children: [1,2] };// CAT
  this.rules[27].opcodes[1] = { type: 4, index: 28 };// RNM(CR)
  this.rules[27].opcodes[2] = { type: 4, index: 29 };// RNM(LF)

  /* CR */
  this.rules[28].opcodes = [];
  this.rules[28].opcodes[0] = { type: 6, string: [13] };// TBS

  /* LF */
  this.rules[29].opcodes = [];
  this.rules[29].opcodes[0] = { type: 6, string: [10] };// TBS

  // The `toString()` function will display the original grammar file(s) that produced these opcodes.
  this.toString = function toString(){
    let str = "";
    str += "; Lenient version of https://datatracker.ietf.org/doc/html/rfc6265#section-4.2.1\n";
    str += "lenient-cookie-string        = lenient-cookie-entry *( \";\" OWS lenient-cookie-entry )\n";
    str += "lenient-cookie-entry         = lenient-cookie-pair / lenient-cookie-pair-invalid\n";
    str += "lenient-cookie-pair          = OWS lenient-cookie-name OWS \"=\" OWS lenient-cookie-value OWS\n";
    str += "lenient-cookie-pair-invalid  = OWS 1*tchar OWS ; Allow for standalone entries like \"fizz\" to be ignored\n";
    str += "lenient-cookie-name          = 1*( %x21-3A / %x3C / %x3E-7E ) ; Allow all printable US-ASCII except \"=\"\n";
    str += "lenient-cookie-value         = lenient-quoted-value [ *lenient-cookie-octet ] / *lenient-cookie-octet\n";
    str += "lenient-quoted-value         = DQUOTE *( lenient-quoted-char ) DQUOTE\n";
    str += "lenient-quoted-char          = %x20-21 / %x23-7E ; Allow all printable US-ASCII except DQUOTE\n";
    str += "lenient-cookie-octet         = %x21-2B / %x2D-3A / %x3C-7E\n";
    str += "                             ; Allow all printable characters except CTLs, semicolon and SP\n";
    str += "\n";
    str += "; https://datatracker.ietf.org/doc/html/rfc6265#section-4.2.1\n";
    str += "cookie-string     = cookie-pair *( \";\" SP cookie-pair )\n";
    str += "\n";
    str += "; https://datatracker.ietf.org/doc/html/rfc6265#section-4.1.1\n";
    str += "; https://www.rfc-editor.org/errata/eid5518\n";
    str += "cookie-pair       = cookie-name \"=\" cookie-value\n";
    str += "cookie-name       = token\n";
    str += "cookie-value      = ( DQUOTE *cookie-octet DQUOTE ) / *cookie-octet\n";
    str += "                  ; https://www.rfc-editor.org/errata/eid8242\n";
    str += "cookie-octet      = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E\n";
    str += "                       ; US-ASCII characters excluding CTLs,\n";
    str += "                       ; whitespace, DQUOTE, comma, semicolon,\n";
    str += "                       ; and backslash\n";
    str += "\n";
    str += "; https://datatracker.ietf.org/doc/html/rfc6265#section-2.2\n";
    str += "OWS            = *( [ CRLF ] WSP ) ; \"optional\" whitespace\n";
    str += "\n";
    str += "; https://datatracker.ietf.org/doc/html/rfc9110#section-5.6.2\n";
    str += "token          = 1*(tchar)\n";
    str += "tchar          = \"!\" / \"#\" / \"$\" / \"%\" / \"&\" / \"'\" / \"*\"\n";
    str += "                 / \"+\" / \"-\" / \".\" / \"^\" / \"_\" / \"`\" / \"|\" / \"~\"\n";
    str += "                 / DIGIT / ALPHA\n";
    str += "                 ; any VCHAR, except delimiters\n";
    str += "\n";
    str += "; https://datatracker.ietf.org/doc/html/rfc2616#section-2.2\n";
    str += "CHAR           = %x01-7F ; any US-ASCII character (octets 0 - 127)\n";
    str += "CTL            = %x00-1F / %x7F ; any US-ASCII control character\n";
    str += "separators     = \"(\" / \")\" / \"<\" / \">\" / \"@\" / \",\" / \";\" / \":\" / \"\\\" / %x22 / \"/\" / \"[\" / \"]\" / \"?\" / \"=\" / \"{\" / \"}\" / SP / HT\n";
    str += "SP             = %x20 ; US-ASCII SP, space (32)\n";
    str += "HT             = %x09 ; US-ASCII HT, horizontal-tab (9)\n";
    str += "\n";
    str += "; https://datatracker.ietf.org/doc/html/rfc5234#appendix-B.1\n";
    str += "ALPHA          =  %x41-5A / %x61-7A ; A-Z / a-z\n";
    str += "DIGIT          =  %x30-39 ; 0-9\n";
    str += "DQUOTE         =  %x22 ; \" (Double Quote)\n";
    str += "WSP            =  SP / HTAB ; white space\n";
    str += "HTAB           =  %x09 ; horizontal tab\n";
    str += "CRLF           =  CR LF ; Internet standard newline\n";
    str += "CR             =  %x0D ; carriage return\n";
    str += "LF             =  %x0A ; linefeed\n";
    return str;
  }
}
