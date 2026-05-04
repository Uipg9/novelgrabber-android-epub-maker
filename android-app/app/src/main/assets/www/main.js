/**
 * Main UI Script - Universal Novel to EPUB Creator
 * Supports multiple novel sites with automatic decryption
 */

// ============ CIPHER TABLES FOR CHRYSANTHEMUMGARDEN ============
// These are substitution ciphers - each maps font-family to cipher key
// The cipher key is a 52-char string mapping abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
const STANDARD_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const CIPHER_DATA = [
    // Legacy cipher
    { key: "tonquerzlawicvfjpsyhgdmkbxJKABRUDQZCTHFVLIWNEYPSXGOM", selector: "span.jum" },
    
    // Font-based ciphers - comprehensive list from WebToEpub community
    { key: "qVTPNEAHbykpxiYtlWdOzUGnsMcZXBQuSaRKICJwgFLDefrvhmjo", selector: "span[style*='ZxXoTeIptL']" },
    { key: "qVTPNEAHbykpxiYtlWdOzUGnsMcZXBQuSaRKICJwgFLDefrvhmjo", selector: "span[style*='SmnZWhqOAx']" },
    { key: "qVTPNEAHbykpxiYtlWdOzUGnsMcZXBQuSaRKICJwgFLDefrvhmjo", selector: "span[style*='jawWRTCocy']" },
    { key: "qVTPNEAHbykpxiYtlWdOzUGnsMcZXBQuSaRKICJwgFLDefrvhmjo", selector: "span[style*='aqkKEZHHIL']" },
    { key: "PwyUBVTYqAXxZMfEjrSeDazCkWoivHJbKltNdLOhupgImQscnFRG", selector: "span[style*='ijqXQijeiD']" },
    { key: "PwyUBVTYqAXxZMfEjrSeDazCkWoivHJbKltNdLOhupgImQscnFRG", selector: "span[style*='xEKQbXjOoW']" },
    { key: "dTKbCMwpkGWJrJOUiFVesPoXRfQSmuvqglEyDBLnzIYHAZcaxthN", selector: "span[style*='WTKNOkuWha']" },
    { key: "JznCuUZtTgKGAkvwBSOYLHsihaNEPpMVefWRoqlymbjcIXrdQDFx", selector: "span[style*='rnlfJtfRCW']" },
    { key: "cHMZtWYfaEipjXbRPLogAFSBDVrOmUNxIlkeCszTuwKhdJnGqQyv", selector: "span[style*='LPJMfkmHKG']" },
    { key: "cHMZtWYfaEipjXbRPLogAFSBDVrOmUNxIlkeCszTuwKhdJnGqQyv", selector: "span[style*='UokbKmPUVp']" },
    { key: "cHMZtWYfaEipjXbRPLogAFSBDVrOmUNxIlkeCszTuwKhdJnGqQyv", selector: "span[style*='pYQzZYzhvO']" },
    { key: "vDxtzobGrXESwLWypAkZOMBYQNsdPUTVcFhnHajgRmiKfeuCIJlq", selector: "span[style*='EjUwPEOFVm']" },
    { key: "vDxtzobGrXESwLWypAkZOMBYQNsdPUTVcFhnHajgRmiKfeuCIJlq", selector: "span[style*='JYCwWuItpK']" },
    { key: "vDxtzobGrXESwLWypAkZOMBYQNsdPUTVcFhnHajgRmiKfeuCIJlq", selector: "span[style*='HjvKbDCsDH']" },
    { key: "vDxtzobGrXESwLWypAkZOMBYQNsdPUTVcFhnHajgRmiKfeuCIJlq", selector: "span[style*='FZzvJXfXjM']" },
    { key: "iKhDSORsAbqBtGNYpecfHQEwklxJlWCmTLjFdzrPXuvVonMygUZa", selector: "span[style*='PWJEddcfVv']" },
    { key: "gjkChAdlBJYOVIxTXnisWLvmyEMtuGzPpaebFDcZoRHSwUrNfqKQ", selector: "span[style*='ofcUGYMWCy']" },
    { key: "gjkChAdlBJYOVIxTXnisWLvmyEMtuGzPpaebFDcZoRHSwUrNfqKQ", selector: "span[style*='hJrIMhiLIW']" },
    { key: "gjkChAdlBJYOVIxTXnisWLvmyEMtuGzPpaebFDcZoRHSwUrNfqKQ", selector: "span[style*='CKQpJYfVGz']" },
    { key: "gjkChAdlBJYOVIxTXnisWLvmyEMtuGzPpaebFDcZoRHSwUrNfqKQ", selector: "span[style*='FtQhmWcHlO']" },
    { key: "FGqNYQLTPUHecErxRuCjBkDXbMaKyfzOhJdipolAgWItZVsnmSvw", selector: "span[style*='hffmcMyCbf']" },
    { key: "FGqNYQLTPUHecErxRuCjBkDXbMaKyfzOhJdipolAgWItZVsnmSvw", selector: "span[style*='oopuxRZzGs']" },
    { key: "upTZVvjGaMwRBUXelqJACQfFkybrEnmoWcgHxYPztSshDOIdLiKN", selector: "span[style*='ktlmWRazmy']" },
    { key: "upTZVvjGaMwRBUXelqJACQfFkybrEnmoWcgHxYPztSshDOIdLiKN", selector: "span[style*='XteTTFfBwp']" },
    { key: "upTZVvjGaMwRBUXelqJACQfFkybrEnmoWcgHxYPztSshDOIdLiKN", selector: "span[style*='vTsEgzHdeB']" },
    { key: "upTZVvjGaMwRBUXelqJACQfFkybrEnmoWcgHxYPztSshDOIdLiKN", selector: "span[style*='QTJYYDvgYZ']" },
    { key: "RWOVtgzYjNfXMPQqscdZKwrLlFBCevhHSAEDIpnoGTukibyxamJU", selector: "span[style*='UxneBYgsjE']" },
    { key: "RWOVtgzYjNfXMPQqscdZKwrLlFBCevhHSAEDIpnoGTukibyxamJU", selector: "span[style*='GESzRDldDz']" },
    { key: "RWOVtgzYjNfXMPQqscdZKwrLlFBCevhHSAEDIpnoGTukibyxamJU", selector: "span[style*='agiYJLaNhO']" },
    { key: "uZCQtkAyRnJgxGVTbEXYwOBlWhvmKqoPrjdceHNDpUzfsFMaisIL", selector: "span[style*='XMgbgIppHk']" },
    { key: "uZCQtkAyRnJgxGVTbEXYwOBlWhvmKqoPrjdceHNDpUzfsFMaisIL", selector: "span[style*='WAEgGENQGl']" },
    { key: "inDFJlbUacwvHOIdxushAoLVMZCSeYjPXkzNtQRfyqTrpWGgmEBK", selector: "span[style*='lqagMDCZsf']" },
    { key: "inDFJlbUacwvHOIdxushAoLVMZCSeYjPXkzNtQRfyqTrpWGgmEBK", selector: "span[style*='XAGRhgiWCi']" },
    { key: "inDFJlbUacwvHOIdxushAoLVMZCSeYjPXkzNtQRfyqTrpWGgmEBK", selector: "span[style*='VdkZRxEDIa']" },
    { key: "inDFJlbUacwvHOIdxushAoLVMZCSeYjPXkzNtQRfyqTrpWGgmEBK", selector: "span[style*='NnlpXLPYsJ']" },
    { key: "ikvXhpVftrOcGCBaZxgFSwmWEjbAoLePKnTqUDMIyJdRlQuzsYNH", selector: "span[style*='UTBCOGYVcD']" },
    { key: "ikvXhpVftrOcGCBaZxgFSwmWEjbAoLePKnTqUDMIyJdRlQuzsYNH", selector: "span[style*='SAztEkpncx']" },
    { key: "ikvXhpVftrOcGCBaZxgFSwmWEjbAoLePKnTqUDMIyJdRlQuzsYNH", selector: "span[style*='BHKZRynEjD']" },
    { key: "HwSjBkqPuabFCNgvlXGiEDpZJURnfKoLATOyQImshtYdWMVrecxz", selector: "span[style*='neTnLsdxBa']" },
    { key: "HwSjBkqPuabFCNgvlXGiEDpZJURnfKoLATOyQImshtYdWMVrecxz", selector: "span[style*='oLXxkTmMQX']" },
    { key: "EdmCAkeowsNOfGJKbMgTitzIUjLxnrYQZXqcvuylWHDSphRBaFVP", selector: "span[style*='LQrKfqvDvK']" },
    { key: "EdmCAkeowsNOfGJKbMgTitzIUjLxnrYQZXqcvuylWHDSphRBaFVP", selector: "span[style*='qIUlUtuNsf']" },
    { key: "EdmCAkeowsNOfGJKbMgTitzIUjLxnrYQZXqcvuylWHDSphRBaFVP", selector: "span[style*='GpaunVnKiX']" },
    { key: "YuZqUFnHITMGlebCtQrKLSgfxJvDwsBiaWRkNdEXmOjVzohAycpP", selector: "span[style*='qmmADVPJyD']" },
    { key: "YuZqUFnHITMGlebCtQrKLSgfxJvDwsBiaWRkNdEXmOjVzohAycpP", selector: "span[style*='uXOSwTSgPx']" },
    { key: "YuZqUFnHITMGlebCtQrKLSgfxJvDwsBiaWRkNdEXmOjVzohAycpP", selector: "span[style*='hWNUQoIPWi']" },
    { key: "VStMAakjpfRQFUGWeqrguCdblcvYIDHNKzywBxLTnsZmPJiXEohO", selector: "span[style*='PeJqMdmbmg']" },
    { key: "VStMAakjpfRQFUGWeqrguCdblcvYIDHNKzywBxLTnsZmPJiXEohO", selector: "span[style*='SAOyHmauIh']" },
    { key: "VStMAakjpfRQFUGWeqrguCdblcvYIDHNKzywBxLTnsZmPJiXEohO", selector: "span[style*='RwXmycqDuM']" },
    { key: "KFhayuLfBRAgqJvnjeSHwPMUQzEcrTpbkOZxVlYNiXstGoWImCDd", selector: "span[style*='ezkyzoAbFA']" },
    { key: "KFhayuLfBRAgqJvnjeSHwPMUQzEcrTpbkOZxVlYNiXstGoWImCDd", selector: "span[style*='sLdJMcyDQQ']" },
    { key: "KFhayuLfBRAgqJvnjeSHwPMUQzEcrTpbkOZxVlYNiXstGoWImCDd", selector: "span[style*='RSoYmrQIwj']" },
    { key: "WmydfBRPVIODTuxMEtYFqeQSzcjnKsXwapCkoUJZAvlGhLiNgbHr", selector: "span[style*='HGQJysWqTs']" },
    { key: "WmydfBRPVIODTuxMEtYFqeQSzcjnKsXwapCkoUJZAvlGhLiNgbHr", selector: "span[style*='HcJqBFtyNm']" },
    { key: "DwChjXeaLTrHMBxEzfsuPKmWcJqZbiASNlVRFpGgkQdUoyOvntYI", selector: "span[style*='rMPWDRxgHG']" },
    { key: "DwChjXeaLTrHMBxEzfsuPKmWcJqZbiASNlVRFpGgkQdUoyOvntYI", selector: "span[style*='sExoCVPPaw']" },
    { key: "DwChjXeaLTrHMBxEzfsuPKmWcJqZbiASNlVRFpGgkQdUoyOvntYI", selector: "span[style*='ZufVlOvExu']" },
    { key: "DwChjXeaLTrHMBxEzfsuPKmWcJqZbiASNlVRFpGgkQdUoyOvntYI", selector: "span[style*='puZrtBgrLD']" },
    { key: "EmIhxnBkJVTwsuPQqvAcOaSyeXKDoztpYCNRFgMGrLlHiWfbUjdZ", selector: "span[style*='pTVOQGCqnJ']" },
    { key: "EmIhxnBkJVTwsuPQqvAcOaSyeXKDoztpYCNRFgMGrLlHiWfbUjdZ", selector: "span[style*='riwhyYaCJZ']" },
    { key: "EmIhxnBkJVTwsuPQqvAcOaSyeXKDoztpYCNRFgMGrLlHiWfbUjdZ", selector: "span[style*='tFQOgrCLXY']" },
    { key: "EmIhxnBkJVTwsuPQqvAcOaSyeXKDoztpYCNRFgMGrLlHiWfbUjdZ", selector: "span[style*='LFZIIGEjZT']" },
    { key: "VROtYexfAGoarQSWZcuCypvNMljiIUbqHKmkhXgPdnTFwJEDBLzs", selector: "span[style*='EsmkhjcGTx']" },
    { key: "VROtYexfAGoarQSWZcuCypvNMljiIUbqHKmkhXgPdnTFwJEDBLzs", selector: "span[style*='MtnArFkuWF']" },
    { key: "VROtYexfAGoarQSWZcuCypvNMljiIUbqHKmkhXgPdnTFwJEDBLzs", selector: "span[style*='pinxYloNte']" },
    { key: "PwzuNiaQBycMxhZfElTdLkegHRUJrjWKXVYmADoqntOCGsSIpFbv", selector: "span[style*='lOFLTaIJJX']" },
    { key: "PwzuNiaQBycMxhZfElTdLkegHRUJrjWKXVYmADoqntOCGsSIpFbv", selector: "span[style*='DzljzVWfYC']" },
    { key: "PwzuNiaQBycMxhZfElTdLkegHRUJrjWKXVYmADoqntOCGsSIpFbv", selector: "span[style*='QmczwfIsfD']" },
    { key: "QphrHZeTVRUWlKmCsdXEGuwbaovSFIJDfnqOcYBixkzjLMAgyNtP", selector: "span[style*='EXvmBtYero']" },
    { key: "QphrHZeTVRUWlKmCsdXEGuwbaovSFIJDfnqOcYBixkzjLMAgyNtP", selector: "span[style*='fkIbKbXagm']" },
    { key: "QphrHZeTVRUWlKmCsdXEGuwbaovSFIJDfnqOcYBixkzjLMAgyNtP", selector: "span[style*='cSNnlFjStm']" },
    { key: "QphrHZeTVRUWlKmCsdXEGuwbaovSFIJDfnqOcYBixkzjLMAgyNtP", selector: "span[style*='UydKzzhRTw']" },
    { key: "neLPzpigAlGXRhDkQbSJyvIwVjYxfoOMcqsENrUWtmTFCZHaBduK", selector: "span[style*='TXMhPjQFOO']" },
    { key: "neLPzpigAlGXRhDkQbSJyvIwVjYxfoOMcqsENrUWtmTFCZHaBduK", selector: "span[style*='rnUsFAZIoi']" },
    { key: "neLPzpigAlGXRhDkQbSJyvIwVjYxfoOMcqsENrUWtmTFCZHaBduK", selector: "span[style*='zqPFkcmlDB']" },
    { key: "neLPzpigAlGXRhDkQbSJyvIwVjYxfoOMcqsENrUWtmTFCZHaBduK", selector: "span[style*='psxLlxvDlG']" },
    { key: "agNUKtWLPAiYezZrJpCbQuqTGMcVxHnjlSfvRImkswOEdDyBXhoF", selector: "span[style*='dkBcnpgeJt']" },
    { key: "agNUKtWLPAiYezZrJpCbQuqTGMcVxHnjlSfvRImkswOEdDyBXhoF", selector: "span[style*='bOAsAnIqgm']" },
    { key: "LzRsNxDJpbYSdGhcXuCgoqnFmrHEiZjyMtOfIKPATvwQBVakleWU", selector: "span[style*='OTDqowDNJD']" },
    { key: "LzRsNxDJpbYSdGhcXuCgoqnFmrHEiZjyMtOfIKPATvwQBVakleWU", selector: "span[style*='jLITCzXuHE']" },
    { key: "LzRsNxDJpbYSdGhcXuCgoqnFmrHEiZjyMtOfIKPATvwQBVakleWU", selector: "span[style*='aToYvDDcst']" },
    { key: "LzRsNxDJpbYSdGhcXuCgoqnFmrHEiZjyMtOfIKPATvwQBVakleWU", selector: "span[style*='JGpfeKaLoi']" },
    { key: "zBnNYbFxfkPLZXrViQtEMSRsepyvdwJgDCmWcauGqToHKhIjUAlO", selector: "span[style*='dxRSLHKLcU']" },
    { key: "zBnNYbFxfkPLZXrViQtEMSRsepyvdwJgDCmWcauGqToHKhIjUAlO", selector: "span[style*='MFDvucCdUp']" },
    { key: "zBnNYbFxfkPLZXrViQtEMSRsepyvdwJgDCmWcauGqToHKhIjUAlO", selector: "span[style*='xAniWuvZCH']" },
    { key: "ZBnzlOeqoWJatxTLMNpDCYIFdfQvwbUEjGumHikrVXPKRcShsygA", selector: "span[style*='tempdGoNKG']" },
    { key: "ZBnzlOeqoWJatxTLMNpDCYIFdfQvwbUEjGumHikrVXPKRcShsygA", selector: "span[style*='POlcPLTnhM']" },
    { key: "ZBnzlOeqoWJatxTLMNpDCYIFdfQvwbUEjGumHikrVXPKRcShsygA", selector: "span[style*='dvsEFNaARu']" },
    { key: "CmWkeQxEgfFYuAXHUwpVRGiMvJbBdojPalhrsSZDqLyOKtTNIcnz", selector: "span[style*='RIdELIilkj']" },
    { key: "CmWkeQxEgfFYuAXHUwpVRGiMvJbBdojPalhrsSZDqLyOKtTNIcnz", selector: "span[style*='BQcYLatSHs']" },
    { key: "CmWkeQxEgfFYuAXHUwpVRGiMvJbBdojPalhrsSZDqLyOKtTNIcnz", selector: "span[style*='eoNevgwurb']" },
    { key: "CmWkeQxEgfFYuAXHUwpVRGiMvJbBdojPalhrsSZDqLyOKtTNIcnz", selector: "span[style*='FVIjXgtEsb']" },
    { key: "SwVuEnpXNaxfrihyQFIPOLmMYZUjlvRJeHodbDGATsBkztgcqWCK", selector: "span[style*='xyYMpmrjDy']" },
    { key: "SwVuEnpXNaxfrihyQFIPOLmMYZUjlvRJeHodbDGATsBkztgcqWCK", selector: "span[style*='wNznjOOtYT']" },
    { key: "TsaIRfGZnyhKvYobSeUgOBmlXCAVcwHzpLDxduPtJFQNiWrMjkqE", selector: "span[style*='uiFvBMKztH']" },
    { key: "TsaIRfGZnyhKvYobSeUgOBmlXCAVcwHzpLDxduPtJFQNiWrMjkqE", selector: "span[style*='EodGVdlrVD']" },
    { key: "TsaIRfGZnyhKvYobSeUgOBmlXCAVcwHzpLDxduPtJFQNiWrMjkqE", selector: "span[style*='VFxVMHNiyK']" },
    { key: "whxqtFgAkKVdZEpWzBsvSUNjLfIPuHabrCDRGXeQolyTOciJMYnm", selector: "span[style*='zVUvrgnjGF']" },
    { key: "MxaoiDLZktbgBpfmuGqXdJwsSCOYryHVRUKlzNvAnTjIWchPQFeE", selector: "span[style*='YJTTXEElyw']" },
    { key: "MxaoiDLZktbgBpfmuGqXdJwsSCOYryHVRUKlzNvAnTjIWchPQFeE", selector: "span[style*='JArjxBdbNx']" },
    { key: "XBPQJaTEScurUgntLhipeROoKksGzAYCWMjqFdZlwmbDHvyINVfx", selector: "span[style*='jKdnmmYzTH']" },
    { key: "xoymMIDzBNkQVEnXGOaiThpeAjWUcZvPlJLCfwtKSbsYrdRqugFH", selector: "span[style*='sLNjyzpFun']" },
    { key: "xoymMIDzBNkQVEnXGOaiThpeAjWUcZvPlJLCfwtKSbsYrdRqugFH", selector: "span[style*='YIpLipOQtY']" },
    { key: "qVGZydWjAotzwmuvXfrBbTRHLiDKpxanSQlechMsYgPJCEIFUONk", selector: "span[style*='UPyRYJCIZw']" },
    { key: "ErZUfzIKaAPqYwLFCVdeOQJkSTHxuGlphobMgNcsXjinDWmByRtv", selector: "span[style*='muRQDjktod']" },
    { key: "ErZUfzIKaAPqYwLFCVdeOQJkSTHxuGlphobMgNcsXjinDWmByRtv", selector: "span[style*='bYLeCyGAyw']" },
    { key: "ErZUfzIKaAPqYwLFCVdeOQJkSTHxuGlphobMgNcsXjinDWmByRtv", selector: "span[style*='fubDGAMdrs']" },
    { key: "ErZUfzIKaAPqYwLFCVdeOQJkSTHxuGlphobMgNcsXjinDWmByRtv", selector: "span[style*='hMLHuWmifY']" },
    { key: "ErZUfzIKaAPqYwLFCVdeOQJkSTHxuGlphobMgNcsXjinDWmByRtv", selector: "span[style*='JhSNQSznhI']" },
    { key: "geLIkWUOrHlZdTcESQRPhpwsnGboMVuyJNjtzYXBqKDCAfmxFvia", selector: "span[style*='LFHdpmoCtX']" },
    { key: "xvlNyZqJuzshckbdajUWmEKGCrRPOwTHIBAFYLnpfeMSDXQVtgio", selector: "span[style*='nrUGbDZxOA']" },
    { key: "ViphqmcezIsEnaBKkUGoyQJxrufTYOLRFjwlXStDAHdWMPvbCNZg", selector: "span[style*='SEhBEutKiF']" },
    { key: "ViphqmcezIsEnaBKkUGoyQJxrufTYOLRFjwlXStDAHdWMPvbCNZg", selector: "span[style*='gxlbCbioBG']" },
    { key: "SDhCdAvmspcaFJMxRNBriZnoHeWKYgbQwVtkPXTLEUjOfzGqyIlu", selector: "span[style*='yqYCWpzUCb']" },
    { key: "SDhCdAvmspcaFJMxRNBriZnoHeWKYgbQwVtkPXTLEUjOfzGqyIlu", selector: "span[style*='TzIvcRHwNP']" },
    { key: "SDhCdAvmspcaFJMxRNBriZnoHeWKYgbQwVtkPXTLEUjOfzGqyIlu", selector: "span[style*='xGZLphqtxF']" },
    { key: "icHNSUwesAGBaCnZYgQVkdjbeWIPXfpDyJtForhvMzuKTqRlxOLm", selector: "span[style*='bvEEthIsQN']" },
    { key: "MFbcZDXiNudarsGYTogEAUjBxyIvzkSHVRwKfQOWmhLqtneplPCJ", selector: "span[style*='MNBRlrkiJZ']" },
    { key: "pbqUHJZxnMOjQtAuEyoemXIilPNcDTdazWkKgGLRhwYfBSFCVsvr", selector: "span[style*='FZaOyZdeRR']" },
    { key: "TLkrzWIdXhBpqmDytFvMJQAngUaCfVbPHijlRYCusZoONKEGSexw", selector: "span[style*='aBlnHoVyKJ']" },
    { key: "TLkrzWIdXhBpqmDytFvMJQAngUaCfVbPHijlRYCusZoONKEGSexw", selector: "span[style*='WKbmIlnXoB']" },
    { key: "TLkrzWIdXhBpqmDytFvMJQAngUaCfVbPHijlRYCusZoONKEGSexw", selector: "span[style*='YqCuBwtOTL']" },
    { key: "HqOPjeAgIRWtQFyaKBCVGNZrUXdopflwMYEivJsSTucDxnhbzmLk", selector: "span[style*='XgFmlXGwXh']" },
    { key: "lMiDtBgoaKXzIhdLfGjQScPbTEHNemZkCxuRFUqvnJwsVyOrWYAp", selector: "span[style*='Degoefaiuy']" },
    { key: "CRLUaqKEwPhAdFIYZDQNpxBnSisvjucGTzOgfekXJbmrWtoVyHlM", selector: "span[style*='ZxafLETnpI']" },
    { key: "CRLUaqKEwPhAdFIYZDQNpxBnSisvjucGTzOgfekXJbmrWtoVyHlM", selector: "span[style*='twBiVBYzHD']" },
    { key: "wGEnejTOVNDQxFqiHgbWZtLydJlcSouXBPKrYvzACkmplRhMsfUa", selector: "span[style*='QOOWMbROXb']" },
    { key: "ELzZxnXGphkCMRFmAuBfIyvgiwjDSNtlJqaHPWObsUQreVYTKcdo", selector: "span[style*='ycYNnojOqG']" },
    { key: "ELzZxnXGphkCMRFmAuBfIyvgiwjDSNtlJqaHPWObsUQreVYTKcdo", selector: "span[style*='WHarmuvKbg']" },
    { key: "ltTWhQwUrJcBPAuvRjSskzKOVYgHZeyIdFfqMpoxXnEmLCGiNabD", selector: "span[style*='XrvXnqKaqP']" },
    { key: "eOqaECAymwKpRhdcvWNLTxUHgnVXfSoMjPJkZQbDtBFGizYrIlsu", selector: "span[style*='QEhATCDVqE']" },
    { key: "eOqaECAymwKpRhdcvWNLTxUHgnVXfSoMjPJkZQbDtBFGizYrIlsu", selector: "span[style*='KtsYVqTANh']" },
    { key: "eOqaECAymwKpRhdcvWNLTxUHgnVXfSoMjPJkZQbDtBFGizYrIlsu", selector: "span[style*='aGnVdLlqOe']" },
    { key: "ERzndSqFrxuDMNtkVyOYfeTjcIJPaHwhovGKCgQZbWLAmBpsXiUl", selector: "span[style*='LLlVMCxDmi']" },
    { key: "ERzndSqFrxuDMNtkVyOYfeTjcIJPaHwhovGKCgQZbWLAmBpsXiUl", selector: "span[style*='WyQkYVjbMG']" },
    { key: "xPUhYNEyqXpjClKvZLJwFHWukfRnIdcVODAgrzQMtaBimbGoeTsS", selector: "span[style*='LXRYsUabLi']" },
    { key: "xPUhYNEyqXpjClKvZLJwFHWukfRnIdcVODAgrzQMtaBimbGoeTsS", selector: "span[style*='xXYBjQqnOB']" },
    { key: "kxWYnNJzIrCuoSHAeEBVTFQfaRyhMDwgmXdPZpOGUnLiKvtscjql", selector: "span[style*='KTueDeyFJz']" },
    { key: "kxWYnNJzIrCuoSHAeEBVTFQfaRyhMDwgmXdPZpOGUnLiKvtscjql", selector: "span[style*='EKJutKehes']" },
    { key: "iDZOLYCJEXRfQsucWoTlkqeFtNSaUIwvHMpnzPKdVGhjbAgBxmyr", selector: "span[style*='VfhIGwDqiv']" },
    { key: "EDBHyibcKYCjtFmzgVArLIRXndfPhuwvTOseZlUaoxNpGJqMWkSQ", selector: "span[style*='rsikuNaABZ']" },
    { key: "EDBHyibcKYCjtFmzgVArLIRXndfPhuwvTOseZlUaoxNpGJqMWkSQ", selector: "span[style*='TyYpNlHGqQ']" },
    { key: "EDBHyibcKYCjtFmzgVArLIRXndfPhuwvTOseZlUaoxNpGJqMWkSQ", selector: "span[style*='tilkxaDAKV']" },
    { key: "jweUWMzgtNpxCblFiGIOPRvBHoJXZDVmQnTLuYhdfrEcKakAsSqy", selector: "span[style*='AaaWpuDsFO']" },
    { key: "MLTjxanXPEUrhyKpRfdNAzebCkWlovqQBgDSZuGciHmswYFOIVJt", selector: "span[style*='mMigVYVPkh']" },
    { key: "TqAocipRUanGQmJlSxWZMgHhCrIPkfVFKbEwjXLdBeNsYuOzDtyv", selector: "span[style*='ecPBZDLame']" },
    { key: "eDCzyBhMrKZJnNadoxOLtmiIvHTcPbSRYlfqukUgAGXspwVQFEWj", selector: "span[style*='LlUbFemamT']" },
    { key: "FINtlAjGYqeXHKDuPdBhpsWvQnLSJmrbxkyzwZogcfRVOUTECaMi", selector: "span[style*='YjFRqpzjbO']" },
    { key: "qBCDbvnRtgEZPYaNmJGUIcdsSHFMQKhyzxpWejTVilXfowOuAkrL", selector: "span[style*='vNCJTwAHtI']" },
    { key: "qBCDbvnRtgEZPYaNmJGUIcdsSHFMQKhyzxpWejTVilXfowOuAkrL", selector: "span[style*='SFZergSQdR']" },
    { key: "qBCDbvnRtgEZPYaNmJGUIcdsSHFMQKhyzxpWejTVilXfowOuAkrL", selector: "span[style*='QbpSrRgIWf']" },
    { key: "XiFDICeMQtqEvboVjuhdcOgySaNzwBJGKWrPfTAmnsRHUxYLZkpl", selector: "span[style*='UaHKTKJaLj']" },
    { key: "XiFDICeMQtqEvboVjuhdcOgySaNzwBJGKWrPfTAmnsRHUxYLZkpl", selector: "span[style*='tHOGSBvGvH']" },
    { key: "PoEHTVZptQiJXjvdMUqhAfCxSuLNksIrFykbWwGoezDRlYamcgnB", selector: "span[style*='JelXiZWjqn']" },
    { key: "PoEHTVZptQiJXjvdMUqhAfCxSuLNksIrFykbWwGoezDRlYamcgnB", selector: "span[style*='KuKqAgrObF']" },
    { key: "LAnBhRjcwgZbvlCrNmQTqKXyFDPdJVEGzaWYIikSoetHUfxsuMpO", selector: "span[style*='pqeNICVeYY']" },
    { key: "LAnBhRjcwgZbvlCrNmQTqKXyFDPdJVEGzaWYIikSoetHUfxsuMpO", selector: "span[style*='frTLQoITGa']" },
    { key: "HfdFkPlmYisAcWLtKICaXeguDRnphZTJwEQqOGVzjoSvMByNxbrU", selector: "span[style*='MTCIjhSEgc']" },
    { key: "mLPWMFVSInDUzBxivJhoOwlCZEpgAGqsyQfrjXabedKHNkTRYtuc", selector: "span[style*='eaCWdzKiSy']" },
    { key: "mLPWMFVSInDUzBxivJhoOwlCZEpgAGqsyQfrjXabedKHNkTRYtuc", selector: "span[style*='fYhOhxLutT']" },
    { key: "bEHGfOrjzDQIWKCBxXhvetgdNnJTFVuAyPscZqRSwoalmpMYiUkL", selector: "span[style*='BPFfSYocak']" },
    { key: "bEHGfOrjzDQIWKCBxXhvetgdNnJTFVuAyPscZqRSwoalmpMYiUkL", selector: "span[style*='jCCblwrbDy']" },
    { key: "AqlHphQCbUZgnYieWuwLzTvJMFxIPKtRmoarEskDVjGNcfXyBdOS", selector: "span[style*='rFqBSlNmQg']" },
    { key: "AqlHphQCbUZgnYieWuwLzTvJMFxIPKtRmoarEskDVjGNcfXyBdOS", selector: "span[style*='PDoQPQnKrK']" },
    { key: "AqlHphQCbUZgnYieWuwLzTvJMFxIPKtRmoarEskDVjGNcfXyBdOS", selector: "span[style*='HaaaLlaAWj']" },
    { key: "ZhBxqGpCuKXjcVQebPlmHgzsdvritDUSWaYwJnlyLEMRONoAkfFT", selector: "span[style*='xggDezWQIA']" },
    { key: "ZhBxqGpCuKXjcVQebPlmHgzsdvritDUSWaYwJnlyLEMRONoAkfFT", selector: "span[style*='pkUlKuiMEG']" },
    { key: "NXFoTgnBCDVqEKeyxGrRlwjkhaIWdHpZsJfYMQSUAtLziOmvcubP", selector: "span[style*='xmUEQgNMDz']" },
    { key: "NXFoTgnBCDVqEKeyxGrRlwjkhaIWdHpZsJfYMQSUAtLziOmvcubP", selector: "span[style*='ztApfShCSk']" },
    { key: "ZCmagAnbByNiEIvutJqOpLxrSQfhzwjDUVRlMFKGXTWPHoYcksed", selector: "span[style*='rnwCJUQnAq']" },
    { key: "aDtPrWLUgMHlGbkvsQCeoTNAxYjzXcuKEyqIfJRdBOFmZwiSpnVh", selector: "span[style*='VditYbQcZY']" },
    { key: "RlquQNEITOWSUAmcJKBeYijVdgtDosPCapXzxGfLhnbvwHMZrkyF", selector: "span[style*='OFiEQvBOob']" },
    { key: "RlquQNEITOWSUAmcJKBeYijVdgtDosPCapXzxGfLhnbvwHMZrkyF", selector: "span[style*='ZqMJRMigmG']" },
    { key: "RlquQNEITOWSUAmcJKBeYijVdgtDosPCapXzxGfLhnbvwHMZrkyF", selector: "span[style*='bSklgZaayS']" },
    { key: "gXGiFupUyltQdSezsofMPVcqHLBROTmCNEYrZhaWDkKAIJbxvwjn", selector: "span[style*='JHQBMyeLrw']" },
    { key: "gXGiFupUyltQdSezsofMPVcqHLBROTmCNEYrZhaWDkKAIJbxvwjn", selector: "span[style*='XDMJrfZZtd']" },
    { key: "yXUOpZCFJTvGrnoeuLMlgzdxjcSERPmfwKIDiNYVsWHtbBqQAahk", selector: "span[style*='WeJpVkXZPy']" },
    { key: "yXUOpZCFJTvGrnoeuLMlgzdxjcSERPmfwKIDiNYVsWHtbBqQAahk", selector: "span[style*='vldYYCYsCO']" },
    { key: "yXUOpZCFJTvGrnoeuLMlgzdxjcSERPmfwKIDiNYVsWHtbBqQAahk", selector: "span[style*='gGsRAzxSEg']" },
    { key: "cqaYjtiIAXehDVgUGCBfPsTJNELzZwyHnWRSlMudokFpQvmKrObx", selector: "span[style*='xMXYGAdONu']" },
    { key: "AiHqunvkxlfdBZNgPwFCtMIYXOEVyLczSRsaKmGhJUeTbDpjoQrW", selector: "span[style*='DyxVyjMiPr']" },
    { key: "LeGblOkQZRWdVHtXJDBPKCvhANjwEIcyrYaMmFgTsoUfSpzxqnui", selector: "span[style*='HVqkKFQEUi']" },
    { key: "SBGwfKvctrjOmdyzXAYJWxhqReUDIaLiEFTNulPZoHgbksMpVQCn", selector: "span[style*='yAxrzFRSed']" },
    { key: "fKTZFizMDpxBcRWINtoqSPChldAvGeHnOJugkXwLmUYyrasVQEbj", selector: "span[style*='GshieJHwvz']" },
    { key: "fKTZFizMDpxBcRWINtoqSPChldAvGeHnOJugkXwLmUYyrasVQEbj", selector: "span[style*='mNDrOMRoyK']" },
    { key: "eCPpVmfshBHdcASJFquMKNLlYtnoGkZxQvUEgzWDOjwRbxiarTIy", selector: "span[style*='gYyzuCQCxm']" },
    { key: "hrGNJQxmbjuUDROFWpHsLcnBPIvkVYtAadeoCwqyEMizlTKgZXfS", selector: "span[style*='OeEgxHEDTY']" },
    { key: "hrGNJQxmbjuUDROFWpHsLcnBPIvkVYtAadeoCwqyEMizlTKgZXfS", selector: "span[style*='GglixuNUPp']" },
    { key: "wZkprtAulnqVFOfcvSPaDTMYdXymNQsGUILJWBiebxhEoCgjRKHz", selector: "span[style*='obYashdtJI']" },
    { key: "xBWHdOJEbXlAPhqLgtNeSoysaKGvcQIFnZrVMUuCkpDmRzifTwYj", selector: "span[style*='elxfqZjXRa']" },
    { key: "YzklSNaconDsutOixICrJZwHeAyUEPhQBpFdTbjVmfRWqLvgXGKM", selector: "span[style*='dMCmWigFHx']" },
];

// Build cipher tables - map FROM cipher TO standard (for decryption)
const cipherTables = new Map();
for (const { key, selector } of CIPHER_DATA) {
    const table = new Map();
    for (let i = 0; i < STANDARD_ALPHABET.length; i++) {
        // key[i] is the cipher char, STANDARD_ALPHABET[i] is what it decrypts to
        table.set(key[i], STANDARD_ALPHABET[i]);
    }
    cipherTables.set(selector, table);
}

// ============ SUPPORTED SITES CONFIG ============
const SITE_CONFIGS = {
    'chrysanthemumgarden.com': {
        name: 'ChrysanthemumGarden',
        hasEncryption: true,
        chapterListSelector: '.chapter-item a, .chapters a, a[href*="/chapter"]',
        contentSelectors: ['#novel-content', '.novel-content', '.chapter-content', '.entry-content'],
        titleSelectors: ['.novel-title', 'h1.entry-title', '.entry-title', 'h1'],
        authorSelectors: ['.novel-author a', '.author a', 'a[href*="/author/"]'],
        coverSelectors: [
            '.novel-cover img', 
            '.seriesimg img', 
            'img.attachment-post-thumbnail', 
            '.cover img', 
            '.entry-content > img:first-of-type',
            'img[src*="chrysanthemumgarden"]',
            'article img:first-of-type'
        ],
        chapterPattern: /chapter|ch[\s.-]*\d/i
    },
    'novelhall.com': {
        name: 'NovelHall',
        chapterListSelector: '.chapter-list a, #morelist a',
        contentSelectors: ['#htmlContent', '.entry-content'],
        titleSelectors: ['h1', '.book-name'],
        authorSelectors: ['.book-author a', '.author'],
        coverSelectors: ['.book-img img'],
        chapterPattern: /chapter|ch[\s.-]*\d/i
    },
    'novelfull.com': {
        name: 'NovelFull',
        chapterListSelector: '.list-chapter a',
        contentSelectors: ['#chapter-content', '.chapter-c'],
        titleSelectors: ['h3.title', '.truyen-title'],
        authorSelectors: ['.author'],
        coverSelectors: ['.book img'],
        chapterPattern: /chapter|ch[\s.-]*\d/i
    },
    'readnovelfull.com': {
        name: 'ReadNovelFull',
        chapterListSelector: '.list-chapter a, #list-chapter a',
        contentSelectors: ['#chr-content', '#chapter-content'],
        titleSelectors: ['.title', 'h1'],
        authorSelectors: ['.author a'],
        coverSelectors: ['.book img', '.cover img'],
        chapterPattern: /chapter|ch[\s.-]*\d/i
    },
    'wuxiaworld.com': {
        name: 'WuxiaWorld',
        chapterListSelector: '.chapter-item a',
        contentSelectors: ['.chapter-content', '#chapter-content'],
        titleSelectors: ['h1', '.novel-title'],
        authorSelectors: ['.author'],
        coverSelectors: ['.novel-cover img'],
        chapterPattern: /chapter|ch[\s.-]*\d/i
    },
    'lightnovelworld.com': {
        name: 'LightNovelWorld',
        chapterListSelector: '.chapter-list a',
        contentSelectors: ['#chapter-container', '.chapter-content'],
        titleSelectors: ['.novel-title', 'h1'],
        authorSelectors: ['.author'],
        coverSelectors: ['.cover img'],
        chapterPattern: /chapter|ch[\s.-]*\d/i
    },
    'royalroad.com': {
        name: 'RoyalRoad',
        chapterListSelector: 'table tbody tr td a, .chapter-row a',
        contentSelectors: ['.chapter-content', '.chapter-inner'],
        titleSelectors: ['h1', '.fic-title h1'],
        authorSelectors: ['.author', '.fic-header a[href*="/profile"]'],
        coverSelectors: ['.fic-header img', '.cover-art-container img'],
        chapterPattern: /chapter|ch[\s.-]*\d/i
    },
    'fanfiction.net': {
        name: 'FanFiction.net',
        chapterListSelector: '#chap_select option',
        contentSelectors: ['#storytext', '#storycontent'],
        titleSelectors: ['#profile_top b.xcontrast_txt'],
        authorSelectors: ['#profile_top a.xcontrast_txt[href*="/u/"]'],
        coverSelectors: ['#profile_top img.cimage'],
        chapterPattern: /./
    },
    'archiveofourown.org': {
        name: 'Archive of Our Own',
        chapterListSelector: '#selected_id option, .chapter.index a',
        contentSelectors: ['#chapters .userstuff', '.chapter .userstuff'],
        titleSelectors: ['h2.title'],
        authorSelectors: ['a[rel="author"]'],
        coverSelectors: [],
        chapterPattern: /./
    },
    'scribblehub.com': {
        name: 'ScribbleHub',
        chapterListSelector: '.toc_ol a, .toc_a',
        contentSelectors: ['#chp_raw', '.chp_raw'],
        titleSelectors: ['.fic_title'],
        authorSelectors: ['.auth_name_fic'],
        coverSelectors: ['.fic_image img'],
        chapterPattern: /./
    },
    'webnovel.com': {
        name: 'WebNovel',
        chapterListSelector: '.content-list a, .chapter-item a',
        contentSelectors: ['.chapter_content', '.cha-words'],
        titleSelectors: ['h1', '.det-title'],
        authorSelectors: ['.author-name'],
        coverSelectors: ['.det-hd-img img', 'img._poster'],
        chapterPattern: /./
    },
    // Generic fallback
    'default': {
        name: 'Generic',
        chapterListSelector: 'a[href]',
        contentSelectors: ['article', '.content', '.entry-content', 'main', '#content'],
        titleSelectors: ['h1', 'title'],
        authorSelectors: ['.author', '.writer'],
        coverSelectors: ['img'],
        chapterPattern: /chapter|ch[\s.-]*\d/i
    }
};

// ============ DOM ELEMENTS ============
const els = {
    sourceUrl: document.getElementById('source-url'),
    btnFetch: document.getElementById('btn-fetch'),
    sourceStatus: document.getElementById('source-status'),
    startChapter: document.getElementById('start-chapter'),
    endChapter: document.getElementById('end-chapter'),
    includeImages: document.getElementById('include-images'),
    password: document.getElementById('password'),
    coverUrl: document.getElementById('cover-url'),
    turboMode: document.getElementById('turbo-mode'),
    safeMode: document.getElementById('safe-mode'),
    batchSize: document.getElementById('batch-size'),
    timeoutSeconds: document.getElementById('timeout-seconds'),
    delay: document.getElementById('delay'),
    removeIndent: document.getElementById('remove-indent'),
    removeNotes: document.getElementById('remove-notes'),
    novelLoading: document.getElementById('novel-loading'),
    novelInfo: document.getElementById('novel-info'),
    novelCover: document.getElementById('novel-cover'),
    novelTitle: document.getElementById('novel-title'),
    novelAuthor: document.getElementById('novel-author'),
    novelDescription: document.getElementById('novel-description'),
    chapterCount: document.getElementById('chapter-count'),
    chapterList: document.getElementById('chapter-list'),
    btnSelectAll: document.getElementById('btn-select-all'),
    btnSelectNone: document.getElementById('btn-select-none'),
    btnCreate: document.getElementById('btn-create'),
    btnCancel: document.getElementById('btn-cancel'),
    progressBar: document.getElementById('progress-bar'),
    progressText: document.getElementById('progress-text'),
    progressLog: document.getElementById('progress-log'),
    donationAmount: document.getElementById('donation-amount'),
    btnDonationCheckout: document.getElementById('btn-donation-checkout'),
    paypalDonationContainer: document.getElementById('paypal-donation-container'),
    btnDecryptEpub: document.getElementById('btn-decrypt-epub'),
    epubFileInput: document.getElementById('epub-file-input')
};

// ============ STATE ============
let state = {
    novelInfo: null,
    chapters: [],
    isRunning: false,
    cancelled: false,
    currentSite: null
};

// ============ INITIALIZATION ============
async function init() {
    // Try to get URL from source tab
    try {
        const data = await chrome.storage.local.get('sourceTab');
        if (data.sourceTab && data.sourceTab.url) {
            els.sourceUrl.value = data.sourceTab.url;
            // Auto-fetch
            fetchNovelInfo();
        }
    } catch (e) {
        console.log('No source tab data or not in extension context');
    }

    // Event listeners
    els.btnFetch.addEventListener('click', fetchNovelInfo);
    els.sourceUrl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') fetchNovelInfo();
    });
    els.btnSelectAll.addEventListener('click', () => selectChapters(true));
    els.btnSelectNone.addEventListener('click', () => selectChapters(false));
    els.btnCreate.addEventListener('click', createEpub);
    els.btnCancel.addEventListener('click', cancelCreation);
    
    // Chapter range filtering - auto-select chapters in range when inputs change
    els.startChapter.addEventListener('input', applyChapterRange);
    els.endChapter.addEventListener('input', applyChapterRange);
    
    // Turbo mode toggle - auto-adjust batch size
    if (els.turboMode) {
        els.turboMode.addEventListener('change', () => {
            if (els.turboMode.checked) {
                els.batchSize.value = '40';
                els.timeoutSeconds.value = '120';
            } else {
                els.batchSize.value = '5';
                els.timeoutSeconds.value = '60';
            }
        });
    }
    
    // Decrypt EPUB - open in new tab (only if button exists)
    if (els.btnDecryptEpub) {
        els.btnDecryptEpub.addEventListener('click', () => {
            // Open the decryptor tool in a new tab
            const decryptorUrl = chrome.runtime?.getURL ? 
                chrome.runtime.getURL('src/tools/decryptor.html') : 
                'decryptor.html';
            window.open(decryptorUrl, '_blank');
        });
    }
    
    // Copy Log button
    const btnCopyLog = document.getElementById('btn-copy-log');
    if (btnCopyLog) {
        btnCopyLog.addEventListener('click', copyLogToClipboard);
    }

    if (els.btnDonationCheckout) {
        els.btnDonationCheckout.addEventListener('click', renderDonationCheckout);
    }

    initializePayPalIfPresent();
}

// Get site config based on URL
function getSiteConfig(url) {
    try {
        const hostname = new URL(url).hostname.replace('www.', '');
        for (const [domain, config] of Object.entries(SITE_CONFIGS)) {
            if (hostname.includes(domain) || domain.includes(hostname)) {
                return { ...config, domain };
            }
        }
    } catch (e) {}
    return { ...SITE_CONFIGS.default, domain: 'default' };
}

// ============ FETCH NOVEL INFO ============
async function fetchNovelInfo() {
    const url = els.sourceUrl.value.trim();
    if (!url) {
        showStatus('Please enter a URL', 'error');
        return;
    }

    const siteConfig = getSiteConfig(url);
    state.currentSite = siteConfig;
    
    showStatus(`Fetching from ${siteConfig.name}...`, 'info');
    els.btnFetch.disabled = true;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Extract using site-specific config
        state.novelInfo = extractNovelInfo(doc, url, siteConfig);
        state.chapters = extractChapterList(doc, url, siteConfig);

        // Display
        displayNovelInfo(state.novelInfo);
        displayChapterList(state.chapters);

        showStatus(`Found ${state.chapters.length} chapters from ${siteConfig.name}`, 'success');
        els.btnCreate.disabled = state.chapters.length === 0;
        els.endChapter.placeholder = state.chapters.length || 'All';

    } catch (error) {
        showStatus('Failed to fetch: ' + error.message, 'error');
        console.error('Fetch error:', error);
    } finally {
        els.btnFetch.disabled = false;
    }
}

function extractNovelInfo(doc, url, config) {
    const info = {
        title: '',
        author: '',
        description: '',
        coverUrl: '',
        url: url
    };

    // Title
    for (const sel of config.titleSelectors) {
        const el = doc.querySelector(sel);
        if (el && el.textContent.trim()) {
            info.title = el.textContent.trim().replace(/\s+/g, ' ');
            break;
        }
    }

    // Author
    for (const sel of config.authorSelectors) {
        const el = doc.querySelector(sel);
        if (el) {
            info.author = el.textContent.trim();
            break;
        }
    }

    // Cover - PRIORITY: og:image and meta tags first (works even with lazy-loaded images)
    // These are reliable even in fetch/headless mode
    const metaCoverSelectors = [
        'meta[property="og:image"]',
        'meta[name="og:image"]',
        'meta[property="twitter:image"]',
        'meta[name="twitter:image"]',
        'link[rel="image_src"]',
        'meta[itemprop="image"]'
    ];
    
    for (const sel of metaCoverSelectors) {
        try {
            const el = doc.querySelector(sel);
            if (el) {
                let src = el.getAttribute('content') || el.getAttribute('href');
                if (src) {
                    // Make absolute URL
                    if (src.startsWith('//')) src = 'https:' + src;
                    else if (src.startsWith('/')) src = new URL(url).origin + src;
                    else if (!src.startsWith('http')) src = new URL(src, url).href;
                    
                    // Validate it's not a generic site logo
                    if (!src.includes('logo') && !src.includes('favicon') && !src.includes('icon')) {
                        info.coverUrl = src;
                        console.log('[Cover] Found via meta tag:', sel, src);
                        break;
                    }
                }
            }
        } catch (e) {}
    }
    
    // If no meta cover, try config selectors (site-specific img tags)
    if (!info.coverUrl) {
        for (const sel of config.coverSelectors) {
            const el = doc.querySelector(sel);
            if (el) {
                let src = el.src || el.getAttribute('data-src') || el.getAttribute('data-lazy-src') || el.getAttribute('data-original');
                if (src) {
                    // Make absolute URL
                    if (src.startsWith('//')) {
                        src = 'https:' + src;
                    } else if (src.startsWith('/')) {
                        const base = new URL(url);
                        src = base.origin + src;
                    } else if (!src.startsWith('http')) {
                        try {
                            src = new URL(src, url).href;
                        } catch (e) {}
                    }
                    info.coverUrl = src;
                    break;
                }
            }
        }
    }
    
    // If still no cover found, try generic approaches
    if (!info.coverUrl) {
        // Try to find any large image that might be a cover
        const genericCoverSelectors = [
            'img[src*="cover"]',
            'img[src*="poster"]',
            'img[class*="cover"]',
            'img[class*="series"]',
            'img[class*="book"]',
            '.entry-content img:first-of-type',
            'article img:first-of-type',
            '.post img:first-of-type'
        ];
        
        for (const sel of genericCoverSelectors) {
            try {
                const el = doc.querySelector(sel);
                if (el) {
                    let src = el.src || el.getAttribute('data-src') || el.getAttribute('data-lazy-src');
                    if (src && !src.includes('avatar') && !src.includes('icon') && !src.includes('logo')) {
                        if (src.startsWith('//')) src = 'https:' + src;
                        else if (src.startsWith('/')) src = new URL(url).origin + src;
                        else if (!src.startsWith('http')) src = new URL(src, url).href;
                        info.coverUrl = src;
                        break;
                    }
                }
            } catch (e) {}
        }
    }

    // Description
    const descSels = ['.novel-description', '.description', '.summary', '.synopsis', 'meta[name="description"]'];
    for (const sel of descSels) {
        const el = doc.querySelector(sel);
        if (el) {
            if (config.hasEncryption) decryptContent(el);
            const text = el.content || el.textContent;
            if (text) {
                info.description = text.trim().substring(0, 500);
                break;
            }
        }
    }

    return info;
}

function extractChapterList(doc, baseUrl, config) {
    const chapters = [];
    const seen = new Set();
    const baseUrlObj = new URL(baseUrl);
    
    // Try site-specific selector first
    let links = doc.querySelectorAll(config.chapterListSelector);
    
    // Fallback to all links if none found
    if (links.length === 0) {
        links = doc.querySelectorAll('a[href]');
    }
    
    for (const link of links) {
        let href = link.href || link.getAttribute('href') || link.value;
        if (!href) continue;
        
        const title = (link.textContent || link.innerText || '').trim().replace(/\s+/g, ' ');
        
        // Make absolute URL
        if (href.startsWith('/')) {
            href = baseUrlObj.origin + href;
        } else if (!href.startsWith('http')) {
            try {
                href = new URL(href, baseUrl).href;
            } catch (e) { continue; }
        }

        // Skip invalid
        if (!title || seen.has(href) || title.length < 2 || title.length > 300) continue;
        if (href.includes('/tag/') || href.includes('/category/') || href.includes('#comments')) continue;
        if (href.includes('javascript:') || href.includes('mailto:')) continue;
        
        // Must match chapter pattern for the site
        const lowerUrl = href.toLowerCase();
        const lowerTitle = title.toLowerCase();
        if (!config.chapterPattern.test(lowerUrl) && !config.chapterPattern.test(lowerTitle)) continue;

        seen.add(href);
        chapters.push({
            title: title,
            url: href,
            selected: true
        });
    }

    // Sort chapters by extracting chapter numbers
    chapters.sort((a, b) => {
        const numA = extractChapterNumber(a.title, a.url);
        const numB = extractChapterNumber(b.title, b.url);
        return numA - numB;
    });

    // Re-index after sorting
    chapters.forEach((ch, i) => ch.index = i);

    return chapters;
}

// Extract chapter number for sorting
function extractChapterNumber(title, url) {
    // Try to find chapter number in title first
    const titleMatch = title.match(/(?:chapter|ch\.?|c)\s*(\d+(?:\.\d+)?)/i) ||
                       title.match(/^(\d+)(?:\s|\.|\:|\-|$)/) ||
                       title.match(/(\d+(?:\.\d+)?)/);
    
    if (titleMatch) {
        return parseFloat(titleMatch[1]);
    }
    
    // Try URL
    const urlMatch = url.match(/chapter[_-]?(\d+)/i) ||
                     url.match(/ch[_-]?(\d+)/i) ||
                     url.match(/\/(\d+)\/?$/);
    
    if (urlMatch) {
        return parseFloat(urlMatch[1]);
    }
    
    return 999999; // Unknown chapters go to end
}

// ============ DISPLAY ============
function displayNovelInfo(info) {
    els.novelLoading.classList.add('hidden');
    els.novelInfo.classList.remove('hidden');
    
    els.novelTitle.textContent = info.title || 'Unknown Title';
    els.novelAuthor.textContent = info.author || 'Unknown Author';
    els.novelDescription.textContent = info.description || '';
    els.chapterCount.textContent = `${state.chapters.length} chapters`;
    
    if (info.coverUrl) {
        els.novelCover.src = info.coverUrl;
        els.novelCover.style.display = 'block';
        els.novelCover.onerror = () => {
            els.novelCover.style.display = 'none';
        };
        // Auto-populate cover URL input so user can see/edit it
        if (els.coverUrl && !els.coverUrl.value) {
            els.coverUrl.value = info.coverUrl;
            els.coverUrl.placeholder = 'Auto-detected ✓';
        }
    } else {
        els.novelCover.style.display = 'none';
    }
}

function displayChapterList(chapters) {
    if (chapters.length === 0) {
        els.chapterList.innerHTML = '<p class="placeholder">No chapters found</p>';
        return;
    }

    els.chapterList.innerHTML = chapters.map((ch, i) => `
        <div class="chapter-item">
            <input type="checkbox" id="ch-${i}" data-index="${i}" ${ch.selected ? 'checked' : ''}>
            <span class="chapter-index">#${i + 1}</span>
            <label for="ch-${i}" class="chapter-title" title="${escapeHtml(ch.title)}">${escapeHtml(ch.title)}</label>
        </div>
    `).join('');

    els.chapterList.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const idx = parseInt(e.target.dataset.index);
            state.chapters[idx].selected = e.target.checked;
        });
    });
}

function selectChapters(selectAll) {
    state.chapters.forEach(ch => ch.selected = selectAll);
    els.chapterList.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = selectAll;
    });
}

// Apply chapter range filter - select only chapters within specified range
function applyChapterRange() {
    if (state.chapters.length === 0) return;
    
    const startVal = els.startChapter.value.trim();
    const endVal = els.endChapter.value.trim();
    
    // Parse values (user enters 1-based, convert to 0-based index)
    const start = startVal ? Math.max(1, parseInt(startVal)) : 1;
    const end = endVal ? Math.min(state.chapters.length, parseInt(endVal)) : state.chapters.length;
    
    // Validate range
    if (isNaN(start) || isNaN(end) || start > end) {
        return; // Invalid range, don't change selection
    }
    
    // Update selection state - only select chapters in range
    state.chapters.forEach((ch, i) => {
        // i is 0-based, start/end are 1-based chapter numbers
        const chapterNum = i + 1;
        ch.selected = (chapterNum >= start && chapterNum <= end);
    });
    
    // Update checkboxes in the UI
    els.chapterList.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        const idx = parseInt(cb.dataset.index);
        cb.checked = state.chapters[idx].selected;
    });
    
    // Show feedback
    const selectedCount = state.chapters.filter(ch => ch.selected).length;
    showStatus(`Selected chapters ${start} to ${end} (${selectedCount} chapters)`, 'info');
}

// ============ STATUS & PROGRESS ============
function showStatus(message, type = 'info') {
    els.sourceStatus.textContent = message;
    els.sourceStatus.className = `status-message visible ${type}`;
}

function updateProgress(percent, text) {
    els.progressBar.style.width = `${percent}%`;
    els.progressText.textContent = text;
}

function log(message, type = '') {
    const timestamp = new Date().toLocaleTimeString();
    const logLine = `[${timestamp}] ${message}`;
    
    // Store in history for Copy Log feature
    logHistory.push(logLine);
    
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = logLine;
    els.progressLog.appendChild(entry);
    els.progressLog.scrollTop = els.progressLog.scrollHeight;
}

// Copy all log history to clipboard
function copyLogToClipboard() {
    const logText = logHistory.join('\n');
    navigator.clipboard.writeText(logText).then(() => {
        // Show brief feedback
        const btn = document.getElementById('btn-copy-log');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = '✓ Copied!';
            btn.style.background = '#10b981';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy log:', err);
        alert('Failed to copy log to clipboard');
    });
}

function initializePayPalIfPresent() {
    if (!els.paypalDonationContainer) return;
    // SDK is loaded on demand in renderDonationCheckout.
}

const PAYPAL_CLIENT_ID = 'AQ6VbxVVRMac4X-DmMzYgdX24TFuf97sipJD8M57JwhVbj8I4RXL0roChvRo7Qke8cHYr3dkfhCEO0wD';

function isExtensionContext() {
    return /^(chrome|edge)-extension:$/.test(window.location.protocol);
}

async function ensurePayPalSdkLoaded() {
    if (window.paypal?.Buttons) {
        return true;
    }

    // Extension pages usually block remote script execution by CSP.
    if (isExtensionContext()) {
        return false;
    }

    const existing = document.querySelector('script[data-paypal-sdk="true"]');
    if (existing) {
        return await new Promise(resolve => {
            if (window.paypal?.Buttons) return resolve(true);
            existing.addEventListener('load', () => resolve(!!window.paypal?.Buttons), { once: true });
            existing.addEventListener('error', () => resolve(false), { once: true });
            setTimeout(() => resolve(!!window.paypal?.Buttons), 5000);
        });
    }

    return await new Promise(resolve => {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture`;
        script.async = true;
        script.dataset.paypalSdk = 'true';
        script.onload = () => resolve(!!window.paypal?.Buttons);
        script.onerror = () => resolve(false);
        document.head.appendChild(script);
    });
}

function showPayPalFallbackMessage(amount) {
    const message = isExtensionContext()
        ? `PayPal checkout is blocked by browser extension security policy.\n\nUse the Android app build for direct checkout, or open this page outside extension context.\n\nAmount entered: $${amount.toFixed(2)}`
        : `PayPal checkout is unavailable right now. Please try again later.\n\nAmount entered: $${amount.toFixed(2)}`;
    alert(message);
}

async function renderDonationCheckout() {
    const amount = parseFloat(els.donationAmount?.value || '0');
    if (!Number.isFinite(amount) || amount <= 0) {
        alert('Please enter a valid donation amount.');
        return;
    }

    if (!els.paypalDonationContainer) {
        return;
    }

    const sdkReady = await ensurePayPalSdkLoaded();
    if (!sdkReady) {
        showPayPalFallbackMessage(amount);
        return;
    }

    const container = els.paypalDonationContainer;
    container.classList.remove('hidden');
    container.innerHTML = '';

    window.paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal'
        },
        createOrder: (_, actions) => {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: amount.toFixed(2)
                    },
                    description: 'Support donation for NovelGrabber'
                }]
            });
        },
        onApprove: async (_, actions) => {
            await actions.order.capture();
            log(`Donation completed: $${amount.toFixed(2)}`, 'success');
            alert('Thank you for supporting development!');
        },
        onError: (err) => {
            console.error('PayPal checkout error:', err);
            log(`PayPal checkout error: ${err?.message || 'Unknown error'}`, 'error');
            alert('PayPal checkout failed. Please try again.');
        }
    }).render(container);
}

// ============ LOG HISTORY FOR COPY BUTTON ============
const logHistory = [];

// ============ RATE LIMITING & SAFETY ============
// Prevents IP bans and handles HTTP 429 errors gracefully

const rateLimiter = {
    lastRequestTime: 0,
    minDelay: 100,      // Minimum 100ms between requests
    maxDelay: 300,      // Maximum 300ms jitter
    retryDelay: 5000,   // 5 second pause on 429
    maxRetries: 3,      // Max retries per request
    
    // Add random jitter to behave more human-like
    async wait() {
        const now = Date.now();
        const elapsed = now - this.lastRequestTime;
        const jitter = Math.random() * (this.maxDelay - this.minDelay) + this.minDelay;
        
        if (elapsed < jitter) {
            await new Promise(r => setTimeout(r, jitter - elapsed));
        }
        this.lastRequestTime = Date.now();
    },
    
    // Handle rate limiting with exponential backoff
    async handleRateLimit(retryCount) {
        const delay = this.retryDelay * Math.pow(2, retryCount);
        console.log(`[Rate Limit] HTTP 429 - waiting ${delay/1000}s before retry...`);
        await new Promise(r => setTimeout(r, delay));
    }
};

// ============ QUALITY CHECK HEURISTICS ============
// Detects garbage text that wasn't properly decrypted

// Common Xianxia/Wuxia/Fantasy terms that might look like garbage but are valid
const FANTASY_TERMS_WHITELIST = new Set([
    // Cultivation terms
    'qi', 'qigong', 'dantian', 'jianghu', 'wulin', 'xianxia', 'wuxia', 'xuanhuan',
    'cultivator', 'tribulation', 'nascent', 'jindan', 'yuanying', 'dongfu',
    // Titles and ranks
    'shifu', 'shidi', 'shixiong', 'shimei', 'shijie', 'shizun', 'shimu',
    'gongzi', 'guniang', 'daozhang', 'zhenren', 'xianren', 'dijun', 'junshang',
    'dage', 'erge', 'sange', 'jiejie', 'meimei', 'gege', 'didi',
    // Places and things
    'pavilion', 'sect', 'clan', 'dynasty', 'realm', 'heavens',
    'talisman', 'formation', 'array', 'artifact', 'elixir', 'pill',
    // Common names/words
    'feng', 'ling', 'xiao', 'chen', 'wang', 'zhang', 'liu', 'wei', 'yan', 'lin',
    'mo', 'shen', 'tian', 'yun', 'han', 'bai', 'qin', 'mu', 'gu', 'chu',
    'zhou', 'xu', 'tang', 'song', 'ming', 'qing', 'yuan', 'jin', 'sui',
    // Martial arts
    'sword', 'saber', 'palm', 'fist', 'stance', 'technique', 'sutra',
    // Misc Chinese words commonly used
    'laoshi', 'xiongdi', 'pengyou', 'aiya', 'aiyah', 'haizi', 'baba', 'mama',
    'gongfu', 'kungfu', 'taichi', 'bagua', 'qinggong', 'neigong', 'waigong',
    // Korean/Japanese terms (for other novels)
    'oppa', 'unnie', 'hyung', 'noona', 'sunbae', 'hoobae', 'senpai', 'kouhai',
    'sama', 'sensei', 'dono', 'chan', 'kun', 'san', 'nim', 'ssi',
]);

function checkContentQuality(text) {
    // Check for high-entropy nonsense strings
    const words = text.split(/\s+/);
    let garbageCount = 0;
    let totalWords = 0;
    
    for (const word of words) {
        // Skip punctuation and very short words
        const clean = word.replace(/[.,!?;:'"()[\]{}]/g, '');
        if (clean.length < 3) continue;
        totalWords++;
        
        // Check if word looks like garbage
        if (isGarbageWord(clean)) {
            garbageCount++;
        }
    }
    
    // If more than 40% of words are garbage, quality is poor (raised from 5% to allow partial CG decryption)
    const garbageRatio = totalWords > 0 ? garbageCount / totalWords : 0;
    const hasTooMuchGarbage = garbageRatio > 0.40;
    
    // Check for readable content - lowered threshold to 3% for fantasy novels
    // Many Xianxia terms have fewer vowels than typical English
    const vowelRatio = (text.match(/[aeiouAEIOU]/g) || []).length / text.length;
    const hasNoVowels = vowelRatio < 0.03 && text.length > 50; // Lowered from 5% to 3%
    
    return {
        isGood: !hasTooMuchGarbage && !hasNoVowels,
        garbageRatio,
        vowelRatio,
        garbageCount,
        totalWords
    };
}

function isGarbageWord(word) {
    if (word.length < 4 || word.length > 10) return false;
    
    // WHITELIST: Skip known fantasy/cultivation terms
    const lowerWord = word.toLowerCase();
    if (FANTASY_TERMS_WHITELIST.has(lowerWord)) {
        return false;
    }
    
    // WHITELIST: Capitalized proper nouns (names) are likely valid
    // e.g., "Jianghu", "Dantian", "Xianxia" - first letter caps, rest lower
    if (/^[A-Z][a-z]+$/.test(word)) {
        return false; // Proper noun pattern - likely a name or term
    }
    
    // CG CIPHER PATTERN: Exactly 6 chars with mixed case like KhZyoX, FI4Wyt, f5WE8z
    // These are the undecrypted cipher remnants
    if (word.length === 6 && /^[a-zA-Z0-9]+$/.test(word)) {
        const hasUpper = /[A-Z]/.test(word);
        const hasLower = /[a-z]/.test(word);
        // Mixed case 6-char alphanumeric = very likely cipher garbage
        if (hasUpper && hasLower) {
            return true;
        }
        // Has numbers mixed with letters
        if (/\d/.test(word) && /[a-zA-Z]/.test(word)) {
            return true;
        }
    }
    
    // Pattern 1: Mixed case with numbers (j5dmql, TC5F28, 4g8RWh) - ALWAYS garbage
    if (/^[a-zA-Z0-9]+$/.test(word) && /\d/.test(word) && /[a-zA-Z]/.test(word)) {
        return true;
    }
    
    // Pattern 2: No vowels with UNUSUAL case mixing (RchYOz, UdgwVx)
    // But allow all-lowercase or all-caps no-vowel words (might be transliteration)
    const vowels = (word.match(/[aeiouAEIOU]/g) || []).length;
    if (vowels === 0 && word.length >= 5) {
        // Only flag if it has weird mixed case
        const hasUpper = /[A-Z]/.test(word);
        const hasLower = /[a-z]/.test(word);
        if (hasUpper && hasLower) {
            return true; // Mixed case + no vowels = garbage
        }
        // All-lowercase or all-caps with no vowels could be valid transliteration
        // e.g., "qngs" might be pinyin abbreviation
    }
    
    // Pattern 3: Very low vowel ratio with UNUSUAL mixed case pattern
    // Be more lenient - only flag if it looks truly random
    if (vowels <= 1 && word.length >= 6 && /[A-Z]/.test(word) && /[a-z]/.test(word)) {
        // Check for alternating caps which is a garbage pattern
        if (/[a-z][A-Z][a-z][A-Z]/.test(word) || /[A-Z][a-z][A-Z][a-z]/.test(word)) {
            return true;
        }
    }
    
    // Pattern 4: Alternating case pattern (aAbBcC style) - ALWAYS garbage
    if (/^([a-z][A-Z])+[a-z]?$/.test(word) || /^([A-Z][a-z])+[A-Z]?$/.test(word)) {
        if (word.length >= 6) return true;
    }
    
    return false;
}

// ============ DYNAMIC CIPHER EXTRACTION ============
// Parses font files to generate cipher mappings for unknown fonts

// Cache for dynamically discovered ciphers
const dynamicCipherCache = new Map();

// Extract font URLs from HTML/CSS
// Parse @font-face rules from CSS text
function parseFontFacesFromCSS(css, fontUrls, baseUrl = '') {
    // More flexible regex patterns for @font-face
    // Pattern 1: Standard format with font-family first
    const pattern1 = /@font-face\s*\{[^}]*font-family:\s*['"]?([^'";}\s]+)['"]?[^}]*src:[^}]*url\(\s*['"]?([^'")\s]+)['"]?\s*\)[^}]*\}/gi;
    
    for (const match of css.matchAll(pattern1)) {
        const fontName = match[1].trim();
        let fontUrl = match[2].trim();
        if (fontUrl.endsWith('.woff') || fontUrl.endsWith('.woff2') || fontUrl.includes('.woff')) {
            // Make URL absolute if relative
            if (baseUrl && !fontUrl.startsWith('http') && !fontUrl.startsWith('//')) {
                try {
                    fontUrl = new URL(fontUrl, baseUrl).href;
                } catch (e) {}
            }
            fontUrls.set(fontName, fontUrl);
            console.log(`[Font Extract] Found font "${fontName}" -> ${fontUrl}`);
        }
    }
    
    // Pattern 2: src might come before font-family in some CSS
    const pattern2 = /@font-face\s*\{[^}]*src:[^}]*url\(\s*['"]?([^'")\s]+\.woff2?)['"]?\s*\)[^}]*font-family:\s*['"]?([^'";}\s]+)['"]?[^}]*\}/gi;
    
    for (const match of css.matchAll(pattern2)) {
        const fontUrl = match[1].trim();
        const fontName = match[2].trim();
        if (!fontUrls.has(fontName)) {
            let resolvedUrl = fontUrl;
            if (baseUrl && !fontUrl.startsWith('http') && !fontUrl.startsWith('//')) {
                try {
                    resolvedUrl = new URL(fontUrl, baseUrl).href;
                } catch (e) {}
            }
            fontUrls.set(fontName, resolvedUrl);
            console.log(`[Font Extract] Found font "${fontName}" -> ${resolvedUrl}`);
        }
    }
    
    // Pattern 3: Just find any .woff URLs and extract name from filename
    const woffPattern = /url\(\s*['"]?([^'")\s]*\.woff2?)['"]?\s*\)/gi;
    for (const match of css.matchAll(woffPattern)) {
        let fontUrl = match[1].trim();
        const fontName = fontUrl.split('/').pop().replace(/\.woff2?$/i, '');
        if (fontName && !fontUrls.has(fontName)) {
            if (baseUrl && !fontUrl.startsWith('http') && !fontUrl.startsWith('//')) {
                try {
                    fontUrl = new URL(fontUrl, baseUrl).href;
                } catch (e) {}
            }
            fontUrls.set(fontName, fontUrl);
            console.log(`[Font Extract] Found font by URL "${fontName}" -> ${fontUrl}`);
        }
    }
}

// Extract font URLs - NOW ASYNC to fetch external stylesheets
async function extractFontUrls(doc, html, baseUrl) {
    const fontUrls = new Map(); // fontName -> url
    
    console.log('[Font Extract] Starting font URL extraction...');
    
    // Method 1: Parse inline <style> tags for @font-face
    const styleElements = doc.querySelectorAll('style');
    console.log(`[Font Extract] Found ${styleElements.length} inline <style> tags`);
    
    styleElements.forEach(style => {
        const css = style.textContent || '';
        parseFontFacesFromCSS(css, fontUrls, baseUrl);
    });
    
    // Method 2: Look for font URLs in the raw HTML (some sites embed in script tags)
    const urlMatches = html.matchAll(/(['"])([^'"]+\.woff2?)\1/gi);
    for (const match of urlMatches) {
        let url = match[2];
        const fontName = url.split('/').pop().replace(/\.woff2?$/, '');
        if (!fontUrls.has(fontName)) {
            if (baseUrl && !url.startsWith('http') && !url.startsWith('//')) {
                try { url = new URL(url, baseUrl).href; } catch (e) {}
            }
            fontUrls.set(fontName, url);
            console.log(`[Font Extract] Found in HTML "${fontName}" -> ${url}`);
        }
    }
    
    // Method 3: CRITICAL - Fetch external stylesheets from <link> tags
    const linkElements = doc.querySelectorAll('link[rel="stylesheet"], link[rel*="style"]');
    console.log(`[Font Extract] Found ${linkElements.length} external stylesheet <link> tags`);
    
    const cssUrls = [];
    linkElements.forEach(link => {
        let href = link.getAttribute('href');
        if (href) {
            // Make absolute URL
            if (href.startsWith('//')) {
                href = 'https:' + href;
            } else if (href.startsWith('/')) {
                try { href = new URL(href, baseUrl).href; } catch (e) {}
            } else if (!href.startsWith('http')) {
                try { href = new URL(href, baseUrl).href; } catch (e) {}
            }
            cssUrls.push(href);
        }
    });
    
    // Also check for @import in inline styles
    const importMatches = html.matchAll(/@import\s+(?:url\()?\s*['"]?([^'");\s]+)['"]?\s*\)?/gi);
    for (const match of importMatches) {
        let importUrl = match[1];
        if (importUrl.endsWith('.css') || importUrl.includes('stylesheet')) {
            if (importUrl.startsWith('//')) {
                importUrl = 'https:' + importUrl;
            } else if (!importUrl.startsWith('http')) {
                try { importUrl = new URL(importUrl, baseUrl).href; } catch (e) {}
            }
            cssUrls.push(importUrl);
        }
    }
    
    console.log(`[Font Extract] Fetching ${cssUrls.length} external CSS files...`);
    
    // Fetch all external stylesheets in parallel
    const cssPromises = cssUrls.map(async (cssUrl) => {
        try {
            console.log(`[Font Extract] Fetching CSS: ${cssUrl}`);
            const response = await fetch(cssUrl, {
                credentials: 'include', // Include cookies for auth
                headers: {
                    'Accept': 'text/css,*/*',
                    'Referer': baseUrl
                }
            });
            
            if (!response.ok) {
                console.warn(`[Font Extract] CSS fetch failed (${response.status}): ${cssUrl}`);
                return null;
            }
            
            const cssText = await response.text();
            console.log(`[Font Extract] Got CSS (${cssText.length} chars) from ${cssUrl}`);
            return { cssUrl, cssText };
        } catch (error) {
            console.warn(`[Font Extract] CSS fetch error for ${cssUrl}:`, error.message);
            return null;
        }
    });
    
    const cssResults = await Promise.all(cssPromises);
    
    // Parse each fetched CSS file
    for (const result of cssResults) {
        if (result) {
            parseFontFacesFromCSS(result.cssText, fontUrls, result.cssUrl);
        }
    }
    
    console.log(`[Font Extract] Total fonts found: ${fontUrls.size}`);
    if (fontUrls.size > 0) {
        console.log('[Font Extract] Font names:', [...fontUrls.keys()]);
    }
    
    return fontUrls;
}

// Find which font is used for encrypted spans
function findEncryptedFontName(doc) {
    const encryptedSpans = doc.querySelectorAll('span[style*="font-family"]');
    for (const span of encryptedSpans) {
        const style = span.getAttribute('style') || '';
        const fontMatch = style.match(/font-family:\s*['"]?([^'";,]+)/i);
        if (fontMatch) {
            return fontMatch[1].trim();
        }
    }
    return null;
}

// Parse WOFF font file to extract cmap (character mapping)
async function parseFontCmap(fontUrl, baseUrl) {
    try {
        // Make URL absolute
        let absoluteUrl = fontUrl;
        if (fontUrl.startsWith('//')) {
            absoluteUrl = 'https:' + fontUrl;
        } else if (fontUrl.startsWith('/')) {
            absoluteUrl = new URL(fontUrl, baseUrl).href;
        } else if (!fontUrl.startsWith('http')) {
            absoluteUrl = new URL(fontUrl, baseUrl).href;
        }
        
        console.log(`[Font Parser] Fetching font: ${absoluteUrl}`);
        
        const response = await fetch(absoluteUrl, {
            credentials: 'include',
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`Font fetch failed: HTTP ${response.status}`);
        }
        
        const buffer = await response.arrayBuffer();
        const cipherKey = await parseWoffCmap(buffer);
        
        if (cipherKey) {
            console.log(`[Font Parser] Generated cipher key: ${cipherKey.substring(0, 20)}...`);
            return cipherKey;
        }
        
        return null;
    } catch (error) {
        console.error('[Font Parser] Error:', error);
        return null;
    }
}

// Decompress a zlib-compressed slice of an ArrayBuffer using DecompressionStream
async function decompressZlib(buffer, byteOffset, byteLength) {
    const compressed = new Uint8Array(buffer, byteOffset, byteLength);
    const ds = new DecompressionStream('deflate');
    const writer = ds.writable.getWriter();
    const reader = ds.readable.getReader();
    writer.write(compressed);
    writer.close();
    const chunks = [];
    let total = 0;
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        total += value.length;
    }
    const out = new Uint8Array(total);
    let pos = 0;
    for (const c of chunks) { out.set(c, pos); pos += c.length; }
    return out.buffer;
}

// Parse WOFF/WOFF2 cmap table to extract character mapping
async function parseWoffCmap(buffer) {
    try {
        const data = new DataView(buffer);
        const STANDARD = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

        const signature = data.getUint32(0, false);
        let offset = 0;

        if (signature === 0x774F4646) { // 'wOFF'
            const numTables = data.getUint16(12, false);
            offset = 44;

            for (let i = 0; i < numTables; i++) {
                const tag = String.fromCharCode(
                    data.getUint8(offset), data.getUint8(offset + 1),
                    data.getUint8(offset + 2), data.getUint8(offset + 3)
                );

                if (tag === 'cmap') {
                    const tableOffset = data.getUint32(offset + 4, false);
                    const compLength = data.getUint32(offset + 8, false);
                    const origLength = data.getUint32(offset + 12, false);

                    if (compLength !== origLength) {
                        try {
                            const decompressed = await decompressZlib(buffer, tableOffset, compLength);
                            const decompView = new DataView(decompressed);
                            return extractCmapMapping(decompView, 0, STANDARD);
                        } catch (e) {
                            console.warn('[Font Parser] Decompression failed:', e);
                            return null;
                        }
                    }

                    return extractCmapMapping(data, tableOffset, STANDARD);
                }
                offset += 20;
            }
        } else if (signature === 0x00010000 || signature === 0x4F54544F) { // TrueType or 'OTTO'
            const numTables = data.getUint16(4, false);
            offset = 12;

            for (let i = 0; i < numTables; i++) {
                const tag = String.fromCharCode(
                    data.getUint8(offset), data.getUint8(offset + 1),
                    data.getUint8(offset + 2), data.getUint8(offset + 3)
                );

                if (tag === 'cmap') {
                    const tableOffset = data.getUint32(offset + 8, false);
                    return extractCmapMapping(data, tableOffset, STANDARD);
                }
                offset += 16;
            }
        }

        console.log('[Font Parser] Unknown font format');
        return null;
    } catch (error) {
        console.error('[Font Parser] Parse error:', error);
        return null;
    }
}

// Extract character mapping from cmap table
function extractCmapMapping(data, cmapOffset, standard) {
    try {
        const version = data.getUint16(cmapOffset, false);
        const numTables = data.getUint16(cmapOffset + 2, false);
        
        // Find format 4 subtable (most common for BMP characters)
        let subtableOffset = 0;
        for (let i = 0; i < numTables; i++) {
            const platformId = data.getUint16(cmapOffset + 4 + i * 8, false);
            const encodingId = data.getUint16(cmapOffset + 6 + i * 8, false);
            const offset = data.getUint32(cmapOffset + 8 + i * 8, false);
            
            // Prefer Windows Unicode BMP (3, 1) or Unicode (0, 3)
            if ((platformId === 3 && encodingId === 1) || (platformId === 0 && encodingId === 3)) {
                subtableOffset = cmapOffset + offset;
                break;
            }
        }
        
        if (!subtableOffset) {
            // Fallback to first subtable
            subtableOffset = cmapOffset + data.getUint32(cmapOffset + 8, false);
        }
        
        const format = data.getUint16(subtableOffset, false);
        
        if (format === 4) {
            // Format 4: Segment mapping to delta values
            return parseFormat4Cmap(data, subtableOffset, standard);
        } else if (format === 12) {
            // Format 12: Segmented coverage
            return parseFormat12Cmap(data, subtableOffset, standard);
        }
        
        console.log(`[Font Parser] Unsupported cmap format: ${format}`);
        return null;
    } catch (error) {
        console.error('[Font Parser] Cmap extraction error:', error);
        return null;
    }
}

// Parse format 4 cmap subtable
function parseFormat4Cmap(data, offset, standard) {
    const segCount = data.getUint16(offset + 6, false) / 2;
    const endCodesOffset = offset + 14;
    const startCodesOffset = endCodesOffset + segCount * 2 + 2;
    const deltaOffset = startCodesOffset + segCount * 2;
    const rangeOffset = deltaOffset + segCount * 2;
    
    // Build mapping: for each standard char, find what glyph it maps to
    const mapping = new Map();
    
    for (let i = 0; i < standard.length; i++) {
        const charCode = standard.charCodeAt(i);
        
        // Find segment containing this character
        for (let seg = 0; seg < segCount; seg++) {
            const endCode = data.getUint16(endCodesOffset + seg * 2, false);
            const startCode = data.getUint16(startCodesOffset + seg * 2, false);
            
            if (charCode >= startCode && charCode <= endCode) {
                const delta = data.getInt16(deltaOffset + seg * 2, false);
                const rangeOffsetValue = data.getUint16(rangeOffset + seg * 2, false);
                
                let glyphIndex;
                if (rangeOffsetValue === 0) {
                    glyphIndex = (charCode + delta) & 0xFFFF;
                } else {
                    const glyphIdOffset = rangeOffset + seg * 2 + rangeOffsetValue + (charCode - startCode) * 2;
                    glyphIndex = data.getUint16(glyphIdOffset, false);
                    if (glyphIndex !== 0) {
                        glyphIndex = (glyphIndex + delta) & 0xFFFF;
                    }
                }
                
                if (glyphIndex > 0 && glyphIndex < 256) {
                    // Map the glyph to a character (this is the cipher)
                    mapping.set(charCode, glyphIndex);
                }
                break;
            }
        }
    }
    
    // Convert mapping to cipher key string
    let cipherKey = '';
    for (const char of standard) {
        const glyphIndex = mapping.get(char.charCodeAt(0));
        if (glyphIndex !== undefined && glyphIndex >= 32 && glyphIndex < 127) {
            cipherKey += String.fromCharCode(glyphIndex);
        } else {
            cipherKey += char; // Keep original if no mapping
        }
    }
    
    return cipherKey.length === 52 ? cipherKey : null;
}

// Parse format 12 cmap subtable  
function parseFormat12Cmap(data, offset, standard) {
    const numGroups = data.getUint32(offset + 12, false);
    const mapping = new Map();
    
    for (let i = 0; i < numGroups; i++) {
        const groupOffset = offset + 16 + i * 12;
        const startCharCode = data.getUint32(groupOffset, false);
        const endCharCode = data.getUint32(groupOffset + 4, false);
        const startGlyphId = data.getUint32(groupOffset + 8, false);
        
        for (let charCode = startCharCode; charCode <= endCharCode; charCode++) {
            const glyphId = startGlyphId + (charCode - startCharCode);
            if (charCode < 256) {
                mapping.set(charCode, glyphId);
            }
        }
    }
    
    let cipherKey = '';
    for (const char of standard) {
        const glyphIndex = mapping.get(char.charCodeAt(0));
        if (glyphIndex !== undefined && glyphIndex >= 32 && glyphIndex < 127) {
            cipherKey += String.fromCharCode(glyphIndex);
        } else {
            cipherKey += char;
        }
    }
    
    return cipherKey.length === 52 ? cipherKey : null;
}

// ============ TAB PROXY FETCH - SAME-ORIGIN SOLUTION ============
// This approach injects fetch logic into the active tab via chrome.scripting.
// The injected function runs in the PAGE CONTEXT with same-origin privileges,
// giving us full access to SameSite=Strict cookies that the extension can't access.
// This matches how WebToEpub works and is the ONLY way to handle password cookies.

/**
 * Injected function that runs INSIDE the active tab's page context.
 * It fetches the chapter URL with full cookie access and handles password submission.
 * 
 * LOGIC ORDER:
 * 1. Fetch HTML
 * 2. Check if content exists (#novel-content) -> Return immediately if readable
 * 3. Only if NO content -> Look for password form and submit
 * 
 * Uses DOMParser for safe parsing (no DOM injection that could trigger security scripts)
 * 
 * @param {string} targetUrl - The chapter URL to fetch
 * @param {string} password - Password for locked chapters (empty if none)
 * @returns {Promise<{success: boolean, html?: string, error?: string}>}
 */
function injectedFetchFunction(targetUrl, password) {
    return new Promise(async (resolve) => {
        try {
            console.log(`[Tab Proxy] Fetching: ${targetUrl}`);
            
            // Fetch the page (same-origin, full cookie access)
            const response = await fetch(targetUrl, {
                credentials: 'include',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Cache-Control': 'no-cache'
                }
            });
            
            if (!response.ok) {
                resolve({ success: false, error: `HTTP ${response.status}` });
                return;
            }
            
            let html = await response.text();
            console.log(`[Tab Proxy] Got HTML: ${html.length} chars`);
            
            // Check for Cloudflare challenge
            if (html.includes('cf-browser-verification') || html.includes('Checking your browser') || 
                html.includes('cf-challenge') || html.includes('_cf_chl')) {
                resolve({ success: false, error: 'Cloudflare challenge detected' });
                return;
            }
            
            // ============ STEP 1: CHECK FOR CONTENT FIRST ============
            // Parse HTML safely with DOMParser (invisible to website)
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Lock phrases that indicate the page is password-protected (not real content!)
            const lockPhrases = [
                'password-locked',
                'temporarily locking',
                'enter the password',
                'password for the chapters is on our discord',
                'need to register to our site',
                'password protected'
            ];
            
            // Helper function to check if text contains lock phrases
            const containsLockPhrase = (text) => {
                const lowerText = text.toLowerCase();
                return lockPhrases.some(phrase => lowerText.includes(phrase.toLowerCase()));
            };
            
            // Check if the chapter content is already readable
            const contentSelectors = ['#novel-content', '.chapter-content', '.entry-content', 'article.content'];
            let hasContent = false;
            let contentText = '';
            for (const sel of contentSelectors) {
                const el = doc.querySelector(sel);
                if (el && el.textContent.trim().length > 100) {
                    contentText = el.textContent.trim();
                    
                    // CHECK FOR LOCK PHRASES - Don't be fooled by warning text!
                    if (containsLockPhrase(contentText)) {
                        console.log(`[Tab Proxy] Content found but contains LOCK PHRASE - page is locked!`);
                        hasContent = false;  // Treat as locked, not as content
                        break;
                    }
                    
                    hasContent = true;
                    console.log(`[Tab Proxy] Content found with selector: ${sel} (${contentText.length} chars)`);
                    break;
                }
            }
            
            // If content is readable AND not locked, return immediately - no password needed!
            if (hasContent) {
                console.log('[Tab Proxy] SUCCESS: Chapter is readable (no password needed)');
                resolve({ success: true, html: html });
                return;
            }
            
            // ============ STEP 2: NO CONTENT - CHECK FOR PASSWORD FORM ============
            console.log('[Tab Proxy] No readable content found, checking for password form...');
            
            // Look for password form indicators
            const passForm = doc.querySelector('form#password-lock') ||
                             doc.querySelector('form:has(input[type="password"])') ||
                             doc.querySelector('form:has(input[name="site-pass"])');
            
            const hasPasswordInput = doc.querySelector('input[type="password"]') !== null ||
                                     doc.querySelector('input[name="site-pass"]') !== null;
            
            if (!passForm && !hasPasswordInput) {
                // No content AND no password form - something is wrong
                console.log('[Tab Proxy] WARNING: No content and no password form found');
                resolve({ success: true, html: html }); // Return anyway, let extraction handle it
                return;
            }
            
            if (!password) {
                resolve({ success: false, error: 'Password-locked page - no password provided' });
                return;
            }
            
            // ============ STEP 3: BUILD FORMDATA MANUALLY FROM PARSED DOC ============
            console.log('[Tab Proxy] Password form detected, building FormData manually...');
            
            const formData = new FormData();
            
            // Find and extract all input fields from the form
            const form = passForm || doc.querySelector('form');
            if (form) {
                const inputs = form.querySelectorAll('input[name]');
                inputs.forEach(input => {
                    const name = input.getAttribute('name');
                    const value = input.getAttribute('value') || '';
                    const type = (input.getAttribute('type') || '').toLowerCase();
                    
                    // Skip submit buttons
                    if (type === 'submit') return;
                    
                    formData.append(name, value);
                    const displayValue = name.toLowerCase().includes('pass') ? '(empty)' : value;
                    console.log(`[Tab Proxy] Captured: ${name} = ${displayValue}`);
                });
            }
            
            // Set the password (this overwrites any empty value)
            formData.set('site-pass', password);
            console.log('[Tab Proxy] Password set for "site-pass"');
            
            // Debug: Show final FormData
            console.log('[Tab Proxy] Final FormData fields:');
            for (const [key, value] of formData.entries()) {
                const displayValue = key.toLowerCase().includes('pass') ? '***' : value;
                console.log(`  ${key} = ${displayValue}`);
            }
            
            // ============ STEP 4: POST THE FORM ============
            console.log(`[Tab Proxy] POSTing to: ${targetUrl}`);
            const postResponse = await fetch(targetUrl, {
                method: 'POST',
                body: formData,
                credentials: 'include',
                redirect: 'follow'
            });
            
            console.log(`[Tab Proxy] POST response: ${postResponse.status} (final URL: ${postResponse.url})`);
            
            if (!postResponse.ok) {
                resolve({ success: false, error: `Password POST failed: HTTP ${postResponse.status}` });
                return;
            }
            
            const postHtml = await postResponse.text();
            
            // Parse POST response to check for content (with lock phrase validation!)
            const postDoc = parser.parseFromString(postHtml, 'text/html');
            let postHasContent = false;
            for (const sel of contentSelectors) {
                const el = postDoc.querySelector(sel);
                if (el && el.textContent.trim().length > 100) {
                    const postText = el.textContent.trim();
                    // Validate: must have content AND not contain lock phrases
                    if (!containsLockPhrase(postText)) {
                        postHasContent = true;
                        break;
                    } else {
                        console.log('[Tab Proxy] POST response still contains lock phrase');
                    }
                }
            }
            
            if (postHasContent) {
                console.log('[Tab Proxy] SUCCESS: Password accepted, content unlocked!');
                resolve({ success: true, html: postHtml });
                return;
            }
            
            // Still no content - try re-fetch (cookie may have been set)
            console.log('[Tab Proxy] POST done but no content yet, re-fetching with cookies...');
            await new Promise(r => setTimeout(r, 500));
            
            const retryResponse = await fetch(targetUrl, {
                credentials: 'include',
                headers: { 'Cache-Control': 'no-cache' }
            });
            
            if (retryResponse.ok) {
                const retryHtml = await retryResponse.text();
                const retryDoc = parser.parseFromString(retryHtml, 'text/html');
                
                for (const sel of contentSelectors) {
                    const el = retryDoc.querySelector(sel);
                    if (el && el.textContent.trim().length > 100) {
                        const retryText = el.textContent.trim();
                        // Validate: must not contain lock phrases
                        if (containsLockPhrase(retryText)) {
                            console.log('[Tab Proxy] Re-fetch still contains lock phrase - password failed');
                            resolve({ success: false, error: 'Password incorrect - page remains locked' });
                            return;
                        }
                        console.log('[Tab Proxy] SUCCESS: Cookie re-fetch worked!');
                        resolve({ success: true, html: retryHtml });
                        return;
                    }
                }
                
                resolve({ success: false, error: 'Password incorrect or session not established' });
            } else {
                resolve({ success: false, error: `Re-fetch failed: HTTP ${retryResponse.status}` });
            }
            
        } catch (error) {
            console.error('[Tab Proxy] Error:', error);
            resolve({ success: false, error: error.message || 'Unknown error' });
        }
    });
}

/**
 * Get a tab that matches the novel's domain (not the extension popup!)
 * @param {string} targetUrl - The chapter URL we want to fetch
 * @returns {Promise<chrome.tabs.Tab>} - The tab hosting the novel site
 */
async function getNovelTab(targetUrl) {
    // Extract the domain (e.g., "chrysanthemumgarden.com")
    const urlObj = new URL(targetUrl);
    const domainPattern = '*://' + urlObj.hostname + '/*';
    
    console.log(`[Tab Proxy] Searching for tab matching: ${domainPattern}`);
    
    // Find a tab that matches this domain
    const tabs = await chrome.tabs.query({ url: domainPattern });
    
    if (tabs.length === 0) {
        throw new Error(`No open tab found for ${urlObj.hostname}. Please open the novel in a browser tab first.`);
    }
    
    console.log(`[Tab Proxy] Found ${tabs.length} matching tab(s), using tab ${tabs[0].id}: ${tabs[0].url}`);
    
    // Return the first matching tab
    return tabs[0];
}

/**
 * Tab Proxy Fetch - Executes fetch in the active tab's page context
 * This gives us same-origin privileges and full cookie access.
 */
async function fetchChapterFast(url, config, options = {}) {
    const { password = '', removeNotes = true, retryCount = 0 } = options;
    const MAX_RETRIES = 3;
    const canUseTabProxy = typeof chrome !== 'undefined' && chrome?.tabs && chrome?.scripting;
    
    console.log(`[Fast Fetch] Starting: ${url} (attempt ${retryCount + 1}/${MAX_RETRIES})`);
    
    try {
        // Apply rate limiting with jitter
        await rateLimiter.wait();

        let result;
        if (canUseTabProxy) {
            // Extension context: use tab proxy for same-origin privileges.
            const tab = await getNovelTab(url);
            if (!tab || !tab.id) {
                throw new Error('No matching tab found - please open the novel site in a browser tab');
            }

            console.log(`[Fast Fetch] Using tab proxy (tab ${tab.id}): ${tab.url}`);

            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: injectedFetchFunction,
                args: [url, password],
                world: 'MAIN'  // CRITICAL: Run in page context, not isolated world
            });
            result = results?.[0]?.result;
        } else {
            // Mobile WebView / plain browser context: run fetch directly without chrome APIs.
            console.log('[Fast Fetch] Running direct headless fetch (non-extension context)');
            result = await injectedFetchFunction(url, password);
        }
        
        if (!result) {
            throw new Error('No result from fetch flow');
        }
        
        if (!result.success) {
            // Handle retryable errors
            if (result.error?.includes('Cloudflare') && retryCount < MAX_RETRIES) {
                console.log(`[Fast Fetch] Cloudflare detected, retrying in 5s...`);
                await sleep(5000);
                return fetchChapterFast(url, config, { ...options, retryCount: retryCount + 1 });
            }
            throw new Error(result.error || 'Unknown error from tab proxy');
        }
        
        let html = result.html;
        console.log(`[Fast Fetch] Got HTML via tab proxy: ${html.length} chars`);
        
        // Parse HTML with DOMParser
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract and decrypt content (with dynamic cipher support)
        const content = await extractAndDecryptContentWithDynamicCipher(doc, html, url, config.contentSelectors, removeNotes);
        
        // QUALITY CHECK: Verify the content is properly decrypted
        const textContent = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        const quality = checkContentQuality(textContent);
        
        if (!quality.isGood) {
            const reason = `Quality check failed: garbage=${(quality.garbageRatio * 100).toFixed(1)}%, vowels=${(quality.vowelRatio * 100).toFixed(1)}%, ${quality.garbageCount}/${quality.totalWords} garbage words`;
            console.warn(`[Fast Fetch] FALLBACK REASON: ${reason}`);
            console.warn('[Fast Fetch] Sample text:', textContent.substring(0, 200));
            throw new Error(reason);
        }
        
        console.log(`[Fast Fetch] SUCCESS - garbage: ${(quality.garbageRatio * 100).toFixed(1)}%, vowels: ${(quality.vowelRatio * 100).toFixed(1)}%`);
        return content;
        
    } catch (error) {
        // Log specific failure reason for debugging
        console.error(`[Fast Fetch] FALLBACK TRIGGERED for ${url}`);
        console.error(`[Fast Fetch] Reason: ${error.message}`);
        throw error;
    }
}

// Extract content from parsed document and apply decryption (with dynamic cipher support)
async function extractAndDecryptContentWithDynamicCipher(doc, html, baseUrl, contentSelectors, removeNotes = true) {
    console.log('[Extract] Starting content extraction with dynamic cipher support...');
    console.log('[Extract] Looking for content with selectors:', contentSelectors);
    
    // Find content container
    let contentEl = null;
    for (const sel of contentSelectors) {
        const el = doc.querySelector(sel);
        if (el) {
            contentEl = el;
            console.log(`[Extract] Found content container with selector: "${sel}"`);
            break;
        }
    }
    
    if (!contentEl) {
        console.error('[Extract] FALLBACK REASON: Content container not found with any selector');
        console.error('[Extract] Available body classes:', doc.body?.className);
        console.error('[Extract] Page title:', doc.title);
        throw new Error('Content container not found - selectors did not match');
    }
    
    // Clone to avoid modifying original
    const clone = contentEl.cloneNode(true);
    
    // Remove unwanted elements first
    const removeSelectors = [
        'script', 'style', 'iframe', 'noscript',
        '.ads', '.ad', '.advertisement', '.adsbygoogle',
        '.nav', '.navigation', '.menu',
        '.comments', '.comment-section', '#comments',
        '.share', '.social', '.sharing',
        '.related', '.recommended',
        '.author-note', '.translator-note', '.tl-note',
        '[id*="google"]', '[class*="sponsor"]',
        '.tooltip-container',
        'form#password-lock'
    ];
    removeSelectors.forEach(s => {
        clone.querySelectorAll(s).forEach(e => e.remove());
    });
    
    // Remove hidden elements (inline styles check - works without rendering!)
    clone.querySelectorAll('*').forEach(el => {
        const style = el.getAttribute('style') || '';
        const className = el.className || '';
        
        // Check for hidden via inline style
        if (style.includes('display: none') || style.includes('display:none') ||
            style.includes('visibility: hidden') || style.includes('visibility:hidden') ||
            style.includes('opacity: 0') || style.includes('opacity:0') ||
            style.includes('font-size: 0') || style.includes('font-size:0')) {
            el.remove();
            return;
        }
        
        // Check for CG's hidden text (same color as background)
        if (style.includes('color: #ffffff') || style.includes('color:#ffffff') ||
            style.includes('color: white') || style.includes('color:white') ||
            style.includes('color: transparent') || style.includes('color:transparent') ||
            style.includes('color: #fff') || style.includes('color:#fff')) {
            el.remove();
            return;
        }
        
        // Check for hidden class names
        const classLower = className.toString().toLowerCase();
        if (classLower.includes('jumpto') || classLower.includes('hidden') || 
            classLower.includes('invisible') || classLower.includes('hide')) {
            el.remove();
            return;
        }
    });
    
    // Track encrypted spans that need decryption
    let decryptCount = 0;
    let unmatchedFonts = new Set();
    
    // Apply decryption to spans with font-family styles
    clone.querySelectorAll('span[style*="font-family"]').forEach(span => {
        const style = span.getAttribute('style') || '';
        let matched = false;
        
        // Find matching cipher from our CIPHER_DATA (hardcoded fast path)
        for (const { key, selector } of CIPHER_DATA) {
            const match = selector.match(/style\*='([^']+)'/);
            if (match && style.includes(match[1])) {
                // Found matching cipher - decrypt!
                const orig = span.textContent;
                const decrypted = decryptWithCipherKey(orig, key);
                span.textContent = decrypted;
                span.removeAttribute('style');
                decryptCount++;
                matched = true;
                break;
            }
        }
        
        // Track unmatched fonts for dynamic extraction
        if (!matched) {
            const fontMatch = style.match(/font-family:\s*['"]?([^'";,]+)/i);
            if (fontMatch) {
                unmatchedFonts.add(fontMatch[1].trim());
            }
        }
    });
    
    // DYNAMIC CIPHER EXTRACTION: If we have unmatched fonts, try to extract cipher from font file
    if (unmatchedFonts.size > 0) {
        console.log(`[Dynamic Cipher] Found ${unmatchedFonts.size} unmatched fonts:`, [...unmatchedFonts]);
        
        // Extract font URLs from the page (NOW ASYNC - fetches external CSS)
        const fontUrls = await extractFontUrls(doc, html, baseUrl);
        
        for (const fontName of unmatchedFonts) {
            // Check cache first
            if (dynamicCipherCache.has(fontName)) {
                const cachedKey = dynamicCipherCache.get(fontName);
                applyDynamicCipher(clone, fontName, cachedKey);
                decryptCount++;
                continue;
            }
            
            // Find font URL
            let fontUrl = fontUrls.get(fontName);
            if (!fontUrl) {
                // Try to find by partial match
                for (const [name, url] of fontUrls) {
                    if (name.includes(fontName) || fontName.includes(name)) {
                        fontUrl = url;
                        break;
                    }
                }
            }
            
            if (fontUrl) {
                console.log(`[Dynamic Cipher] Attempting to parse font: ${fontName} from ${fontUrl}`);
                const cipherKey = await parseFontCmap(fontUrl, baseUrl);
                
                if (cipherKey) {
                    // Cache and apply
                    dynamicCipherCache.set(fontName, cipherKey);
                    applyDynamicCipher(clone, fontName, cipherKey);
                    decryptCount++;
                    console.log(`[Dynamic Cipher] SUCCESS: Generated cipher for ${fontName}`);
                } else {
                    console.warn(`[Dynamic Cipher] FALLBACK REASON: Could not extract cipher from font file: ${fontName}`);
                    console.warn(`[Dynamic Cipher] Font URL was: ${fontUrl}`);
                }
            } else {
                console.warn(`[Dynamic Cipher] FALLBACK REASON: No WOFF URL found for font: ${fontName}`);
                console.warn(`[Dynamic Cipher] Available fonts in page:`, [...fontUrls.keys()]);
            }
        }
        
        // If we have unmatched fonts without ciphers, this will likely cause garbage output
        const stillUnmatched = [...unmatchedFonts].filter(f => !dynamicCipherCache.has(f));
        if (stillUnmatched.length > 0) {
            console.warn(`[Dynamic Cipher] WARNING: ${stillUnmatched.length} fonts still have no cipher: ${stillUnmatched.join(', ')}`);

            // Leave undecoded paragraphs as-is (raw text may be partially scrambled but still readable)
        }
    }
    
    // STATIC CIPHER FALLBACK
    const CG_CIPHER_LIST = [
        { fp:['pCv','pCv'], map:{b:'f',c:'d',e:'k',f:'p',g:'l',h:'m',i:'y',j:'i',k:'s',m:'c',o:'l',p:'t',r:'i',t:'a',v:'e',w:'g',x:'u',A:'n',B:'p',C:'h',E:'T',G:'w',K:'o',P:'o',Q:'s',R:'v',U:'y',X:'b',Y:'r'} },
        { fp:['AOt','iOt','SGD'], map:{b:'l',c:'q',d:'u',e:'q',i:'t',o:'m',p:'c',s:'b',t:'e',v:'i',w:'j',y:'d',z:'g',A:'t',B:'d',C:'o',D:'s',G:'a',H:'p',J:'z',K:'x',M:'f',O:'h',P:'n',Q:'b',R:'v',S:'w',T:'h',W:'r',X:'k',Y:'y',Z:'f'} },
        { fp:['mVg','pLc','oVg'], map:{c:'n',e:'l',g:'e',i:'o',l:'a',m:'t',n:'x',o:'t',p:'l',r:'n',s:'p',v:'y',w:'i',x:'f',y:'d',z:'f',A:'q',B:'v',C:'w',D:'b',G:'j',I:'u',J:'m',K:'h',L:'i',M:'k',N:'r',T:'c',U:'s',V:'h',W:'s',X:'y',Y:'g'} },
        { fp:['rxD','cxD','NfF'], map:{a:'f',c:'t',e:'f',f:'i',j:'p',k:'x',m:'c',p:'i',r:'t',s:'o',t:'q',x:'h',y:'l',z:'d',A:'a',B:'v',D:'e',E:'h',F:'n',G:'o',I:'u',J:'g',K:'k',M:'w',N:'l',O:'m',P:'u',R:'y',S:'r',T:'a',U:'s',W:'q',Y:'b'} },
        { fp:['dIT','nQJ','KLW'], map:{a:'v',c:'x',d:'t',f:'o',g:'b',i:'r',m:'w',o:'w',p:'y',q:'p',r:'a',s:'k',y:'q',A:'s',B:'d',E:'T',G:'c',H:'f',I:'h',J:'n',K:'h',L:'a',N:'g',O:'r',P:'m',Q:'i',S:'f',T:'e',U:'u',W:'i',Y:'l'} },
        { fp:['qBY','vlg','SlX'], map:{c:'m',d:'a',e:'g',g:'n',h:'b',i:'b',j:'y',l:'i',o:'v',p:'u',q:'t',u:'p',v:'l',w:'x',x:'r',A:'f',B:'h',C:'z',D:'w',E:'j',J:'l',L:'f',P:'t',Q:'w',S:'h',T:'o',V:'c',W:'k',X:'s',Y:'e',Z:'d'} },
        { fp:['qnR','ePT','BFH','FKp','Plp','POO'], map:{a:'v',b:'B',d:'i',e:'y',h:'r',l:'l',n:'h',p:'d',q:'t',s:'Q',x:'j',y:'g',c:'I',A:'c',B:'w',E:'D',F:'a',H:'s',K:'n',L:'b',N:'p',O:'f',P:'o',Q:'W',R:'e',T:'u',Y:'F',Z:'m'} },
        { fp:['OoX','oCd','Juz','QUd','uWm'], map:{a:'L',d:'s',f:'x',j:'b',m:'d',o:'h',p:'c',r:'u',t:'g',u:'o',w:'n',y:'m',z:'r',A:'H',C:'i',E:'j',H:'t',J:'f',O:'T',Q:'w',R:'Q',U:'a',V:'k',W:'l',X:'e',Y:'F'} },
        { fp:['vLJ','ejo','jIf','EsJ','EII'], map:{a:'q',e:'y',f:'d',j:'o',k:'t',n:'m',o:'u',s:'r',v:'T',z:'i',C:'p',E:'a',F:'n',I:'l',J:'e',K:'c',L:'h',N:'s',O:'Y',P:'g',U:'I',Z:'k'} },
    ];
    const CG_FINGERPRINT_MAP = new Map();
    for (const cipher of CG_CIPHER_LIST) { for (const fp of cipher.fp) { CG_FINGERPRINT_MAP.set(fp, cipher.map); } }
    function decryptWithStaticCipher(text, cipherMap) {
        let result = '';
        for (const c of text) { result += cipherMap[c] !== undefined ? cipherMap[c] : c; }
        return result;
    }
    const COMMON_WORDS = new Set(['the','and','was','his','her','she','for','are','but','not','you','all','had','they','with','have','from','this','that','been','were','said','him','its','one','who','did','get','has','out','two','way','what','old','man','saw','can','our','yes','day','how']);
    function detectCGCipher(text) {
        const words = text.split(/\s+/);
        for (const w of words) {
            const s = w.replace(/[^a-zA-Z]/g, '');
            if (s.length >= 2 && s.length <= 6 && CG_FINGERPRINT_MAP.has(s)) return CG_FINGERPRINT_MAP.get(s);
        }
        return null;
    }
    function scoreCipher(text, cipherMap) {
        const decoded = decryptWithStaticCipher(text, cipherMap);
        const words = decoded.split(/\s+/);
        let score = 0;
        for (const w of words) {
            const s = w.replace(/[^a-zA-Z]/g, '').toLowerCase();
            if (s.length >= 2 && COMMON_WORDS.has(s)) score++;
            for (const c of s) { if ('etaoinshrdlu'.includes(c)) score += 0.1; }
        }
        return score;
    }
    function detectCGCipherBruteForce(text) {
        let best = null, bestScore = -1;
        for (const cipher of CG_CIPHER_LIST) {
            const score = scoreCipher(text, cipher.map);
            if (score > bestScore) { bestScore = score; best = cipher.map; }
        }
        return bestScore >= 2 ? best : null;
    }
    const allFontSpans = [...clone.querySelectorAll('span[style*="font-family"]')];
    if (allFontSpans.length > 0) {
        const blockMap = new Map();
        for (const span of allFontSpans) {
            const block = span.closest('p, div, li, blockquote') || span.parentElement;
            if (!blockMap.has(block)) blockMap.set(block, []);
            blockMap.get(block).push(span);
        }
        blockMap.forEach((spans, block) => {
            const cipherMap = detectCGCipher(block.textContent) || detectCGCipherBruteForce(block.textContent);
            if (!cipherMap) return;
            for (const span of spans) {
                span.textContent = decryptWithStaticCipher(span.textContent, cipherMap);
                span.removeAttribute('style');
            }
            decryptCount += spans.length;
        });
    }

    // Also handle .jum class (legacy CG cipher)
    clone.querySelectorAll('.jum, span.jum').forEach(el => {
        const jumCipher = CIPHER_DATA.find(c => c.selector === 'span.jum');
        if (jumCipher) {
            const orig = el.textContent;
            const decrypted = decryptWithCipherKey(orig, jumCipher.key);
            el.textContent = decrypted;
            el.classList.remove('jum');
        }
    });
    
    console.log(`[Fast Extract] Decrypted ${decryptCount} spans`);
    
    // Remove watermark elements if removeNotes is enabled
    if (removeNotes) {
        // Remove <i>, <b>, <em>, <strong> with watermarks
        const watermarkTextPatterns = [
            /chrysanthemum\s*garden/i,
            /story translated by/i,
            /translated by/i,
            /please support/i,
            /read more.*at/i,
            /don.?t forget to author/i,
            /forget to author/i,
        ];
        clone.querySelectorAll('i, b, em, strong, span').forEach(el => {
            const text = el.textContent.toLowerCase().trim();
            for (const pattern of watermarkTextPatterns) {
                if (pattern.test(text)) {
                    el.remove();
                    break;
                }
            }
        });
        
        // Remove entire containers that look like author notes
        clone.querySelectorAll('[class*="author"], [class*="note"], [class*="foot"], [class*="say"]').forEach(el => {
            const text = el.textContent.toLowerCase();
            if (text.includes("don't forget") || text.includes("please support") || 
                text.includes("chrysanthemum") || text.includes("forget to author")) {
                el.remove();
            }
        });
    }
    
    // Now extract and clean paragraphs
    return extractCleanParagraphs(clone, removeNotes);
}

// Apply a dynamically extracted cipher to spans with a specific font
function applyDynamicCipher(clone, fontName, cipherKey) {
    clone.querySelectorAll('span[style*="font-family"]').forEach(span => {
        const style = span.getAttribute('style') || '';
        if (style.includes(fontName)) {
            const orig = span.textContent;
            const decrypted = decryptWithCipherKey(orig, cipherKey);
            span.textContent = decrypted;
            span.removeAttribute('style');
        }
    });
}

// Legacy sync version for backward compatibility
function extractAndDecryptContent(doc, contentSelectors, removeNotes = true) {
    // This is a simplified version that only uses hardcoded ciphers
    // The async version above is preferred
    let contentEl = null;
    for (const sel of contentSelectors) {
        const el = doc.querySelector(sel);
        if (el) {
            contentEl = el;
            break;
        }
    }
    
    if (!contentEl) {
        return '<p>Content not found</p>';
    }
    
    const clone = contentEl.cloneNode(true);
    
    // Remove unwanted elements
    const removeSelectors = [
        'script', 'style', 'iframe', 'noscript',
        '.ads', '.ad', '.advertisement', '.adsbygoogle',
        '.nav', '.navigation', '.menu',
        '.comments', '.comment-section', '#comments',
        '.share', '.social', '.sharing',
        '.related', '.recommended',
        '.author-note', '.translator-note', '.tl-note',
        '[id*="google"]', '[class*="sponsor"]',
        '.tooltip-container',
        'form#password-lock'
    ];
    removeSelectors.forEach(s => {
        clone.querySelectorAll(s).forEach(e => e.remove());
    });
    
    // Remove hidden elements
    clone.querySelectorAll('*').forEach(el => {
        const style = el.getAttribute('style') || '';
        const className = el.className || '';
        
        if (style.includes('display: none') || style.includes('display:none') ||
            style.includes('visibility: hidden') || style.includes('visibility:hidden') ||
            style.includes('opacity: 0') || style.includes('opacity:0') ||
            style.includes('font-size: 0') || style.includes('font-size:0')) {
            el.remove();
            return;
        }
        
        if (style.includes('color: #ffffff') || style.includes('color:#ffffff') ||
            style.includes('color: white') || style.includes('color:white') ||
            style.includes('color: transparent') || style.includes('color:transparent') ||
            style.includes('color: #fff') || style.includes('color:#fff')) {
            el.remove();
            return;
        }
        
        const classLower = className.toString().toLowerCase();
        if (classLower.includes('jumpto') || classLower.includes('hidden') || 
            classLower.includes('invisible') || classLower.includes('hide')) {
            el.remove();
            return;
        }
    });
    
    // Apply decryption
    let decryptCount = 0;
    clone.querySelectorAll('span[style*="font-family"]').forEach(span => {
        const style = span.getAttribute('style') || '';
        
        for (const { key, selector } of CIPHER_DATA) {
            const match = selector.match(/style\*='([^']+)'/);
            if (match && style.includes(match[1])) {
                const orig = span.textContent;
                const decrypted = decryptWithCipherKey(orig, key);
                span.textContent = decrypted;
                span.removeAttribute('style');
                decryptCount++;
                break;
            }
        }
    });
    
    clone.querySelectorAll('.jum, span.jum').forEach(el => {
        const jumCipher = CIPHER_DATA.find(c => c.selector === 'span.jum');
        if (jumCipher) {
            const orig = el.textContent;
            const decrypted = decryptWithCipherKey(orig, jumCipher.key);
            el.textContent = decrypted;
            el.classList.remove('jum');
        }
    });
    
    console.log(`[Fast Extract] Decrypted ${decryptCount} spans`);
    
    if (removeNotes) {
        const watermarkTextPatterns = [
            /chrysanthemum\s*garden/i, /story translated by/i, /translated by/i,
            /please support/i, /read more.*at/i, /don.?t forget to author/i, /forget to author/i,
        ];
        clone.querySelectorAll('i, b, em, strong, span').forEach(el => {
            const text = el.textContent.toLowerCase().trim();
            for (const pattern of watermarkTextPatterns) {
                if (pattern.test(text)) { el.remove(); break; }
            }
        });
        
        clone.querySelectorAll('[class*="author"], [class*="note"], [class*="foot"], [class*="say"]').forEach(el => {
            const text = el.textContent.toLowerCase();
            if (text.includes("don't forget") || text.includes("please support") || 
                text.includes("chrysanthemum") || text.includes("forget to author")) {
                el.remove();
            }
        });
    }
    
    return extractCleanParagraphs(clone, removeNotes);
}

// Decrypt text using a cipher key
function decryptWithCipherKey(text, cipherKey) {
    const STANDARD = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = '';
    for (const c of text) {
        const idx = STANDARD.indexOf(c);
        if (idx !== -1 && idx < cipherKey.length) {
            result += cipherKey[idx];
        } else {
            result += c;
        }
    }
    return result;
}

// Extract clean paragraphs from content element
function extractCleanParagraphs(clone, removeNotes) {
    const REMOVE_PATTERNS = [
        /Story translated by.*?Chrysanthemum\s*Garden\.?/gi,
        /translated by.*?Chrysanthemum\s*Garden\.?/gi,
        /Chrysanthemum\s*Garden\.?/gi,
        /(please visit|read at|support us at|visit us at).*?chrysanthemumgarden[^.]*\.?/gi,
        /chrysanthemumgarden\s*\(dot\)\s*com/gi,
        /chrysanthemumgarden\.com/gi,
        /please\s+don['\''`']?t\s+forget\s+to\s+.*?(author|support|vote|comment|rate)[^.]*\.?/gi,
        /don['\''`']?t\s+forget\s+to\s+.*?(author|support|vote|comment|rate)[^.]*\.?/gi,
        /forget\s+to\s+author\.?/gi,
        /please support our translators.*$/gim,
        /read more BL at.*$/gim,
        /^T\/N:.*$/gm,
        /^TL:.*$/gm,
        /^Translator['']?s?\s*[Nn]ote:.*$/gm,
        /^Author['']?s?\s*[Nn]ote:.*$/gm,
    ];
    
    function cleanText(text) {
        text = text.replace(/\s+/g, ' ').trim();
        // Normalize apostrophes
        text = text.replace(/[''`]/g, "'");
        if (removeNotes) {
            for (const pattern of REMOVE_PATTERNS) {
                text = text.replace(pattern, '');
            }
        }
        return text.replace(/\s+/g, ' ').trim();
    }
    
    function shouldSkip(text) {
        if (!removeNotes) return false;
        const lower = text.toLowerCase().replace(/[''`]/g, "'").trim();
        
        // Exact matches
        const skips = [
            'chrysanthemum garden', "please don't forget to author", "don't forget to author",
            "forget to author", 'story translated by chrysanthemum garden',
            'please support our translators', 'read more bl at'
        ];
        if (skips.some(s => lower === s || lower === s + '.')) return true;
        
        // Pattern matches
        if (/^please\s+don.?t\s+forget/i.test(lower)) return true;
        if (/don.?t\s+forget\s+to\s+author/i.test(lower)) return true;
        if (/forget\s+to\s+author/i.test(lower)) return true;
        if (lower.length < 50 && /author|forget|support/.test(lower)) return true;
        
        return false;
    }
    
    // Get paragraphs
    const pElements = clone.querySelectorAll('p');
    const paragraphs = [];
    
    for (const p of pElements) {
        let text = cleanText(p.textContent || '');
        if (!text || text.length < 2) continue;
        if (shouldSkip(text)) continue;
        paragraphs.push(text);
    }
    
    // Format as HTML
    if (paragraphs.length > 0) {
        return paragraphs
            .filter(p => p.length > 2)
            .map(p => `<p>${escapeHtmlLocal(p)}</p>`)
            .join('\n');
    }
    
    // Fallback - get all text
    const rawText = cleanText(clone.textContent || '');
    return rawText ? `<p>${escapeHtmlLocal(rawText)}</p>` : '<p>Content not found</p>';
    
    function escapeHtmlLocal(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}

// ============ TAB-BASED CHAPTER EXTRACTION (FALLBACK) ============
// Used only when fast fetch fails (e.g., password-protected chapters that need JS)

async function fetchChapterViaTab(url, config, options = {}) {
    const { password = '', removeNotes = true, timeoutMs = 60000 } = options;
    
    return new Promise(async (resolve, reject) => {
        let tab = null;
        let timeoutId = null;
        
        try {
            // If password is provided, we need to submit it via the page
            let targetUrl = url;
            
            // Create a background tab
            tab = await chrome.tabs.create({ url: targetUrl, active: false });
            
            // Set timeout (configurable, default 60 seconds)
            timeoutId = setTimeout(() => {
                if (tab) chrome.tabs.remove(tab.id).catch(() => {});
                reject(new Error('Tab loading timeout'));
            }, timeoutMs);
            
            // Wait for tab to finish loading
            await new Promise((resolve) => {
                const listener = (tabId, changeInfo) => {
                    if (tabId === tab.id && changeInfo.status === 'complete') {
                        chrome.tabs.onUpdated.removeListener(listener);
                        resolve();
                    }
                };
                chrome.tabs.onUpdated.addListener(listener);
            });
            
            // Check if page needs password and submit it
            if (password) {
                const passwordResult = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: submitPasswordIfNeeded,
                    args: [password]
                });
                
                // If password was submitted, wait for page reload
                if (passwordResult && passwordResult[0] && passwordResult[0].result) {
                    await new Promise((resolve) => {
                        const listener = (tabId, changeInfo) => {
                            if (tabId === tab.id && changeInfo.status === 'complete') {
                                chrome.tabs.onUpdated.removeListener(listener);
                                resolve();
                            }
                        };
                        chrome.tabs.onUpdated.addListener(listener);
                    });
                    await sleep(300); // Reduced wait time
                }
            }
            
            // Give fonts time to load (reduced for speed)
            await sleep(300);
            
            // Inject extraction script with cipher data and get content
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: extractRenderedContentWithDecrypt,
                args: [config.contentSelectors, CIPHER_DATA, removeNotes]
            });
            
            clearTimeout(timeoutId);
            
            // Close the tab
            await chrome.tabs.remove(tab.id);
            tab = null;
            
            if (results && results[0] && results[0].result) {
                resolve(results[0].result);
            } else {
                reject(new Error('No content extracted'));
            }
            
        } catch (error) {
            if (timeoutId) clearTimeout(timeoutId);
            if (tab) chrome.tabs.remove(tab.id).catch(() => {});
            reject(error);
        }
    });
}

// Function to submit password on CG pages
function submitPasswordIfNeeded(password) {
    const form = document.querySelector('form#password-lock');
    if (!form) return false;
    
    const passwordInput = form.querySelector('input[name="site-pass"]');
    if (!passwordInput) return false;
    
    passwordInput.value = password;
    form.submit();
    return true;
}

// This function runs in the context of the chapter page WITH DECRYPTION
function extractRenderedContentWithDecrypt(contentSelectors, cipherData, removeNotes = true) {
    const STANDARD_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    // Patterns to remove (TL notes, author notes, CG watermarks)
    const REMOVE_PATTERNS = [
        // CG watermarks - comprehensive list
        /Story translated by.*?Chrysanthemum\s*Garden\.?/gi,
        /translated by.*?Chrysanthemum\s*Garden\.?/gi,
        /Chrysanthemum\s*Garden\.?/gi,
        /(please visit|read at|support us at|visit us at).*?chrysanthemumgarden[^.]*\.?/gi,
        /please visit chrysanthemumgarden[^.]*\.?\s*(com)?/gi,
        /visit chrysanthemumgarden[^.]*\.?\s*(com)?/gi,
        /chrysanthemumgarden\s*\(dot\)\s*com/gi,
        /chrysanthemumgarden\.com/gi,
        /read at chrysanthemumgarden/gi,
        /support.*chrysanthemumgarden/gi,
        /read more BL at\s*$/gi,
        /read more at\s*$/gi,
        /please support our translators at\s*$/gi,
        /please support our translators\s*$/gi,
        /support our translators at\s*$/gi,
        // Ultra-aggressive "don't forget to author" patterns - catches ALL variations
        /please\s+don[\''`'']?t\s+forget\s+to\s+.*?(author|support|vote|comment|rate)[^.]*\.?/gi,
        /don[\''`'']?t\s+forget\s+to\s+.*?(author|support|vote|comment|rate)[^.]*\.?/gi,
        /please\s+don[^a-z]*t\s+forget\s+to\s+author[^.]*\.?/gi,
        /don[^a-z]*t\s+forget\s+to\s+author[^.]*\.?/gi,
        /please don't forget to author\.?/gi,
        /don't forget to author\.?/gi,
        /please don.t forget to author\.?/gi,
        /don.t forget to author\.?/gi,
        /Please don't forget to author\.?/gi,
        /forget to author\.?/gi,
        // TL/Author notes
        /^T\/N:.*$/gm,
        /^TL:.*$/gm,
        /^TN:.*$/gm,
        /^Translator['']?s?\s*[Nn]ote:.*$/gm,
        /^Author['']?s?\s*[Nn]ote:.*$/gm,
        /^A\/N:.*$/gm,
        /^Editor['']?s?\s*[Nn]ote:.*$/gm,
        /^E\/N:.*$/gm,
        /^PR:.*$/gm,
        // Support/piracy messages
        /please\s+support\s+(the\s+)?(original\s+)?author/gi,
        /don['']t\s+forget\s+to\s+support/gi,
        /support\s+the\s+original/gi,
        /please\s+read\s+at\s+/gi,
        /if\s+you['']re\s+reading\s+this\s+at/gi,
        /this\s+(chapter|novel)\s+(is\s+)?(being\s+)?stolen/gi,
    ];
    
    // Regex to detect garbage codes (mixed case and/or numbers, 4-8 chars)
    // Patterns like: RchYOz, j5dmql, TC5F28, 6tns, UdgwVx
    function isGarbageCode(text) {
        text = text.trim();
        if (!text || text.length < 3) return false;
        
        // Must be short
        if (text.length > 10) return false;
        
        // Pattern 1: Mixed case letters with numbers (j5dmql, TC5F28)
        if (/^[a-zA-Z0-9]+$/.test(text) && /\d/.test(text) && /[a-zA-Z]/.test(text)) {
            if (text.length >= 4 && text.length <= 8) return true;
        }
        
        // Pattern 2: Mixed case without vowels or weird vowel patterns (RchYOz, UdgwVx)
        if (/^[A-Za-z]+$/.test(text) && text.length >= 4 && text.length <= 8) {
            // Has both upper and lower with unusual pattern
            if (/[A-Z].*[a-z].*[A-Z]/.test(text) || /[a-z].*[A-Z].*[a-z]/.test(text)) {
                return true;
            }
        }
        
        // Pattern 3: Short alphanumeric starting with number (6tns)
        if (/^\d[a-z]+$/i.test(text) && text.length <= 6) {
            return true;
        }
        
        // Pattern 4: Two short nonsense words (Ru fpk, 6tns r)
        if (/^[A-Za-z0-9]{1,4}\s+[a-z]{1,4}$/i.test(text)) {
            return true;
        }
        
        return false;
    }
    
    // Function to remove garbage codes from end of text
    function removeTrailingGarbage(text) {
        let cleaned = text.trim();
        
        // Remove garbage codes at the very end (like "text! j5dmql" or "text. TC5F28")
        // Pattern: sentence ending + space + garbage
        const trailingPatterns = [
            /\s+[A-Za-z][a-z]*\d[A-Za-z0-9]*\s*$/,  // j5dmql, TC5F28
            /\s+\d[a-z]+(\s+[a-z])?\s*$/i,  // 6tns, 6tns r
            /\s+[A-Z][a-z]{1,3}[A-Z][a-z]{0,3}[A-Z]?\s*$/,  // RchYOz, UdgwVx
            /\s+[A-Z]{2,3}[a-z]*\d+[A-Za-z]*\s*$/,  // TC5F28
            /\s+[a-z]\d[a-z]+\s*$/i,  // j5dmql
        ];
        
        for (const pattern of trailingPatterns) {
            cleaned = cleaned.replace(pattern, '');
        }
        
        // Also handle "Ru fpk" style (short word + short word at end)
        cleaned = cleaned.replace(/\s+[A-Z][a-z]\s+[a-z]{2,4}\s*$/g, '');
        
        return cleaned.trim();
    }
    
    // Build cipher tables from passed data
    // The cipher key represents what displays on screen when standard alphabet is in HTML
    // So to decrypt: HTML char (at position i in standard) → key[i] (what it should display as)
    const cipherTables = new Map();
    for (const { key, selector } of cipherData) {
        const table = new Map();
        for (let i = 0; i < STANDARD_ALPHABET.length && i < key.length; i++) {
            // Map: standard char → displayed char (what font would show)
            table.set(STANDARD_ALPHABET[i], key[i]);
        }
        cipherTables.set(selector, table);
    }
    
    // Decrypt function - converts HTML chars to what they should display as
    function decryptWithTable(text, table) {
        return text.split('').map(c => table.get(c) || c).join('');
    }
    
    // Find content container
    let contentEl = null;
    for (const sel of contentSelectors) {
        const el = document.querySelector(sel);
        if (el) {
            contentEl = el;
            break;
        }
    }
    
    if (!contentEl) {
        return '<p>Content not found</p>';
    }
    
    // Clone the content
    const clone = contentEl.cloneNode(true);
    
    // Remove unwanted elements
    const removeSelectors = [
        'script', 'style', 'iframe', 'noscript',
        '.ads', '.ad', '.advertisement', '.adsbygoogle',
        '.nav', '.navigation', '.menu',
        '.comments', '.comment-section', '#comments',
        '.share', '.social', '.sharing',
        '.related', '.recommended',
        '.author-note', '.translator-note', '.tl-note',
        '[id*="google"]', '[class*="sponsor"]',
        'span[style*="display: none"]',
        'span[style*="display:none"]',
        '.tooltip-container', // CG footnotes
        'form#password-lock' // Password form if present
    ];
    removeSelectors.forEach(s => {
        clone.querySelectorAll(s).forEach(e => e.remove());
    });
    
    // Remove <i>, <b>, <em>, <strong> tags that contain watermarks
    if (removeNotes) {
        const watermarkTextPatterns = [
            /chrysanthemum\s*garden/i,
            /story translated by/i,
            /translated by/i,
            /please support/i,
            /read more.*at/i,
        ];
        clone.querySelectorAll('i, b, em, strong').forEach(el => {
            const text = el.textContent.toLowerCase().trim();
            for (const pattern of watermarkTextPatterns) {
                if (pattern.test(text)) {
                    el.remove();
                    break;
                }
            }
        });
    }
    
    // Log all font-family spans we find for debugging
    const allFontSpans = clone.querySelectorAll('span[style*="font-family"]');
    console.log(`[CG Decryptor] Found ${allFontSpans.length} spans with font-family styles`);
    if (allFontSpans.length > 0 && allFontSpans.length <= 10) {
        allFontSpans.forEach((span, i) => {
            console.log(`[CG Decryptor] Span ${i}: style="${span.getAttribute('style')}", text="${span.textContent.substring(0, 30)}..."`);
        });
    }
    
    // DECRYPT: Apply all cipher tables to matching spans
    let decryptCount = 0;
    let matchedSelectors = [];
    for (const [selector, table] of cipherTables) {
        try {
            const matches = clone.querySelectorAll(selector);
            if (matches.length > 0) {
                matchedSelectors.push(selector);
                matches.forEach(el => {
                    const orig = el.textContent;
                    const decrypted = decryptWithTable(orig, table);
                    if (decryptCount < 3) {
                        console.log(`[CG Decryptor] Decrypting with ${selector}: "${orig.substring(0,20)}" → "${decrypted.substring(0,20)}"`);
                    }
                    el.textContent = decrypted;
                    el.removeAttribute('style'); // Remove the font-family style
                    decryptCount++;
                });
            }
        } catch (e) {
            console.error(`[CG Decryptor] Error with selector ${selector}:`, e);
        }
    }
    
    // Also look for spans with inline font-family styles we might have missed
    clone.querySelectorAll('span[style*="font-family"]').forEach(span => {
        const style = span.getAttribute('style') || '';
        // Try to find a matching cipher
        for (const [selector, table] of cipherTables) {
            // Extract font name from selector like span[style*='XYZ']
            const match = selector.match(/style\*='([^']+)'/);
            if (match && style.includes(match[1])) {
                const orig = span.textContent;
                const decrypted = decryptWithTable(orig, table);
                span.textContent = decrypted;
                span.removeAttribute('style');
                decryptCount++;
                break;
            }
        }
    });
    
    console.log(`[CG Decryptor] Decrypted ${decryptCount} encrypted spans using ${matchedSelectors.length} cipher(s)`);
    if (matchedSelectors.length > 0) {
        console.log(`[CG Decryptor] Matched selectors: ${matchedSelectors.join(', ')}`);
    }
    
    // Helper: Clean a text string and optionally remove notes/watermarks
    function cleanText(text) {
        text = text.replace(/\s+/g, ' ').trim();
        
        // Apply removal patterns if removeNotes is enabled
        if (removeNotes) {
            // First normalize curly apostrophes to straight ones for matching
            text = normalizeApostrophes(text);
            
            for (const pattern of REMOVE_PATTERNS) {
                text = text.replace(pattern, '');
            }
            // Remove trailing garbage codes
            text = removeTrailingGarbage(text);
            // Clean up any double spaces left behind
            text = text.replace(/\s+/g, ' ').trim();
        }
        
        return text;
    }
    
    // Helper: Normalize apostrophes (curly to straight)
    function normalizeApostrophes(text) {
        return text.replace(/[''`]/g, "'");
    }
    
    // Helper: Check if paragraph should be skipped entirely (watermarks/standalone site names)
    function shouldSkipParagraph(text) {
        if (!removeNotes) return false;
        
        // Normalize apostrophes before checking
        const normalizedText = normalizeApostrophes(text);
        const lowerText = normalizedText.toLowerCase().trim();
        
        // Skip if it's just a garbage code
        if (isGarbageCode(text)) return true;
        
        // Skip very short standalone watermarks/site names
        const exactSkips = [
            'chrysanthemum garden',
            'chrysanthemum garden.',
            'chrysanthemumgarden',
            'chrysanthemumgarden.',
            'read more bl at',
            'read more at',
            'please support our translators at',
            'please support our translators',
            'support our translators at',
            'story translated by chrysanthemum garden',
            'story translated by chrysanthemum garden.',
            'translated by chrysanthemum garden',
            'translated by chrysanthemum garden.',
            "please don't forget to author",
            "please don't forget to author.",
            "don't forget to author",
            "don't forget to author.",
            "forget to author",
            "forget to author.",
            "please don't forget",
            "please don't forget.",
            "don't forget to",
            "don't forget to.",
            "please don´t forget to author",
            "please don`t forget to author",
        ];
        // Also check with regex for any apostrophe variant
        if (/^please\s+don.?t\s+forget\s+to\s+author\.?$/i.test(lowerText)) return true;
        if (/^don.?t\s+forget\s+to\s+author\.?$/i.test(lowerText)) return true;
        if (/^forget\s+to\s+author\.?$/i.test(lowerText)) return true;
        if (exactSkips.includes(lowerText)) return true;
        
        // Check for patterns that indicate entire paragraph is watermark
        const watermarkPatterns = [
            /^story translated by/i,
            /^translated by.*garden/i,
            /^please support our/i,
            /^support our translators/i,
            /^read more \w+ at\s*$/i,
            /^please visit/i,
            /^visit us at/i,
            /^please don.?t forget to/i,
            /^don.?t forget to author/i,
            /forget to author/i,
            /don.?t forget to\s*$/i,
            /please don.?t forget\s*$/i,
        ];
        for (const pattern of watermarkPatterns) {
            if (pattern.test(lowerText)) return true;
        }
        // Extra check: if text is very short and contains "author" or "forget"
        if (lowerText.length < 50 && (lowerText.includes('forget') || lowerText.includes('author'))) {
            if (/author|forget|support|don.?t/i.test(lowerText)) return true;
        }
        
        const skipIndicators = [
            'translator note',
            'author note',
            'editor note',
            't/n:',
            'a/n:',
            'e/n:',
            'tl:',
            'tn:',
            'pr:',
            'visit us at',
            'support the original',
            'please read at',
            'stolen from',
            'if you\'re reading this anywhere',
            'password is',
            'site password',
            'jjwxc',
            'don\'t forget to author',
            'don\'t forget to rate',
            'please don\'t forget to author',
            'please don\'t forget',
        ];
        
        return skipIndicators.some(indicator => lowerText.includes(indicator));
    }
    
    // Get all paragraph elements
    const pElements = clone.querySelectorAll('p');
    const paragraphs = [];
    
    if (pElements.length > 0) {
        for (const p of pElements) {
            // Get text content AFTER decryption
            let text = p.textContent || '';
            text = cleanText(text);
            
            // Skip empty paragraphs
            if (!text) continue;
            
            // Skip if the entire paragraph is a garbage code
            if (isGarbageCode(text)) continue;
            
            // Skip TL/author notes and watermarks if removeNotes is enabled
            if (shouldSkipParagraph(text)) continue;
            
            // Filter out garbage words that might remain at the end
            const parts = text.split(/\s+/);
            const cleanParts = [];
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const trimmed = part.replace(/[.,!?;:'"()[\]{}]/g, '');
                // Check if this is a garbage code
                if (isGarbageCode(trimmed) && trimmed.length > 2) {
                    // If it's at the end, skip it and everything after
                    if (i >= parts.length - 2) {
                        break;
                    }
                    // If it's in the middle, might be intentional, keep it
                }
                cleanParts.push(part);
            }
            
            text = cleanParts.join(' ').trim();
            
            // Skip if nothing readable remains
            if (text.length < 2) continue;
            
            paragraphs.push(text);
        }
    }
    
    // Format paragraphs
    if (paragraphs.length > 0) {
        const mergedParagraphs = [];
        let buffer = '';
        
        for (let i = 0; i < paragraphs.length; i++) {
            const text = paragraphs[i];
            const words = text.split(/\s+/).length;
            
            // Merge short fragments
            if (words <= 2 && text.length < 15 && !/[.!?]$/.test(text)) {
                buffer = buffer ? buffer + ' ' + text : text;
            } else {
                if (buffer) {
                    if (/^[a-z]/.test(text) || buffer.length < 10) {
                        mergedParagraphs.push(buffer + ' ' + text);
                    } else {
                        mergedParagraphs.push(buffer);
                        mergedParagraphs.push(text);
                    }
                    buffer = '';
                } else {
                    mergedParagraphs.push(text);
                }
            }
        }
        
        if (buffer) {
            if (mergedParagraphs.length > 0 && buffer.length < 20) {
                const last = mergedParagraphs.pop();
                mergedParagraphs.push(last + ' ' + buffer);
            } else {
                mergedParagraphs.push(buffer);
            }
        }
        
        return mergedParagraphs
            .filter(p => p.length > 2)
            .map(p => `<p>${escapeHtml(p)}</p>`)
            .join('\n');
    }
    
    // Fallback
    const rawText = clone.textContent || '';
    const cleanedRaw = cleanText(rawText).split(/\s+/).filter(word => {
        const clean = word.replace(/[.,!?;:'"()[\]{}]/g, '');
        return !isGarbageCode(clean) || word.length <= 2;
    }).join(' ').trim();
    
    return cleanedRaw ? `<p>${escapeHtml(cleanedRaw)}</p>` : '<p>Content not found</p>';
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// ============ CREATE EPUB ============
async function createEpub() {
    const selectedChapters = state.chapters.filter(ch => ch.selected);
    if (selectedChapters.length === 0) {
        showStatus('Please select at least one chapter', 'error');
        return;
    }

    state.isRunning = true;
    state.cancelled = false;
    els.btnCreate.classList.add('hidden');
    els.btnCancel.classList.remove('hidden');
    els.progressLog.innerHTML = '';
    logHistory.length = 0;  // Clear log history

    const delay = parseInt(els.delay.value) || 0;
    const config = state.currentSite || SITE_CONFIGS.default;
    const removeIndent = els.removeIndent?.checked ?? true;
    const removeNotes = els.removeNotes?.checked ?? true;
    const password = els.password?.value?.trim() || '';
    const turboMode = els.turboMode?.checked ?? false;
    const safeMode = els.safeMode?.checked ?? false;
    const customBatchSize = parseInt(els.batchSize?.value) || 5;
    const timeoutSeconds = parseInt(els.timeoutSeconds?.value) || 60;
    const timeoutMs = timeoutSeconds * 1000;

    log(`Starting EPUB creation for ${selectedChapters.length} chapters`);
    if (config.hasEncryption) {
        log(`Site has encryption - using fast headless decryption`);
    }
    if (removeNotes) {
        log(`Will remove TL/Author notes and watermarks`);
    }
    if (password) {
        log(`Password provided for locked chapters`);
    }
    
    // ============ SAFE MODE / AUTO-SEQUENTIAL ============
    // If password is provided OR Safe Mode is checked, force sequential (1 thread)
    // This prevents race conditions where parallel requests fail before cookie is saved
    const forceSequential = safeMode || (password && password.length > 0);
    
    // Concurrency settings - SAFE defaults to avoid rate limiting
    // Even with fast fetch, we throttle to avoid HTTP 429 bans
    // Default: 15 parallel, Turbo: 25 parallel (with built-in rate limiting)
    // Sequential: 1 (for password-protected content)
    let BATCH_SIZE;
    if (forceSequential) {
        BATCH_SIZE = 1;
        log(`🔒 SAFE MODE: Sequential processing (1 thread) for password stability`);
    } else if (turboMode) {
        BATCH_SIZE = 25;
        log(`🚀 TURBO MODE: 25 parallel + auto rate limiting`, 'success');
    } else {
        BATCH_SIZE = Math.min(customBatchSize, 15);
        log(`⚡ Speed: ${BATCH_SIZE} parallel requests (with rate limiting)`);
    }
    
    // Reset rate limiter for new session
    rateLimiter.lastRequestTime = 0;
    
    updateProgress(0, 'Starting...');

    const collectedChapters = [];
    
    // Use fast fetch for encrypted sites (CG) - handles passwords via fetch too!
    // Only fall back to tabs if fast fetch actually fails
    const useFastFetch = config.hasEncryption;
    const startTime = Date.now();
    
    if (useFastFetch) {
        log(`📡 Using FAST FETCH mode (no tabs)`);
    }

    try {
        // Process chapters in batches for speed
        for (let batchStart = 0; batchStart < selectedChapters.length; batchStart += BATCH_SIZE) {
            if (state.cancelled) {
                log('Cancelled by user', 'error');
                break;
            }
            
            const batchEnd = Math.min(batchStart + BATCH_SIZE, selectedChapters.length);
            const batch = selectedChapters.slice(batchStart, batchEnd);
            
            const percent = Math.round((batchStart / selectedChapters.length) * 100);
            updateProgress(percent, `Downloading ${batchStart + 1}-${batchEnd}/${selectedChapters.length}`);
            
            // Process batch in parallel
            const batchPromises = batch.map(async (chapter, batchIndex) => {
                const globalIndex = batchStart + batchIndex;
                log(`Fetching: ${chapter.title}`);
                
                try {
                    let content;
                    
                    if (useFastFetch) {
                        // FAST: Use fetch + DOMParser + cipher tables (no tabs!)
                        content = await fetchChapterFast(chapter.url, config, { password, removeNotes });
                        content = cleanHtmlForEpub(content, removeIndent);
                    } else {
                        // For normal (non-encrypted) sites, use direct fetch with rate limiting
                        await rateLimiter.wait();
                        const response = await fetch(chapter.url, { credentials: 'include' });
                        if (response.status === 429) {
                            throw new Error('Rate limited (HTTP 429)');
                        }
                        const html = await response.text();
                        const doc = new DOMParser().parseFromString(html, 'text/html');
                        content = extractChapterContent(doc, config, removeIndent);
                    }
                    
                    log(`✓ ${chapter.title}`, 'success');
                    
                    return {
                        index: globalIndex,
                        title: chapter.title,
                        content: content,
                        success: true
                    };
                } catch (error) {
                    const isQualityFail = error.message.includes('Quality check');
                    const isRateLimit = error.message.includes('429');
                    const isCloudflare = error.message.includes('403') || error.message.includes('503') || error.message.includes('Cloudflare');
                    const isPassword = error.message.includes('Password') || error.message.includes('password');
                    
                    if (isRateLimit) {
                        log(`⏳ Rate limited on: ${chapter.title} - max retries exceeded`, 'error');
                    } else if (isCloudflare) {
                        log(`🛡️ Cloudflare blocked: ${chapter.title} - max retries exceeded`, 'error');
                    } else if (isQualityFail) {
                        log(`⚠️ Quality check failed: ${chapter.title}`, 'error');
                    } else if (isPassword) {
                        log(`🔒 Password error: ${chapter.title} - ${error.message}`, 'error');
                    } else {
                        log(`✗ Failed: ${chapter.title} - ${error.message}`, 'error');
                    }
                    
                    // STRICT HEADLESS: No tab fallback - chapter simply fails
                    // This keeps the download fast and doesn't open unwanted tabs
                    return {
                        index: globalIndex,
                        title: chapter.title,
                        success: false
                    };
                }
            });
            
            // Wait for batch to complete
            const batchResults = await Promise.all(batchPromises);
            
            // Add successful chapters to collection (maintaining order)
            batchResults.forEach(result => {
                if (result.success) {
                    collectedChapters.push(result);
                }
            });
            
            // Small delay between batches for safety
            if (batchEnd < selectedChapters.length) {
                const batchDelay = delay > 0 ? delay : 200; // Minimum 200ms between batches
                await sleep(batchDelay);
            }
        }
        
        // Sort chapters by original index to maintain order
        collectedChapters.sort((a, b) => a.index - b.index);
        
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

        if (!state.cancelled && collectedChapters.length > 0) {
            updateProgress(90, 'Fetching cover image...');
            
            // Try to get cover image
            let coverData = null;
            const coverUrl = els.coverUrl?.value?.trim() || state.novelInfo.cover;
            
            if (coverUrl) {
                try {
                    log('Fetching cover image...');
                    coverData = await fetchCoverImage(coverUrl);
                    if (coverData) {
                        log('✓ Cover image loaded', 'success');
                    }
                } catch (e) {
                    log(`Could not load cover: ${e.message}`, 'error');
                }
            }
            
            updateProgress(95, 'Building EPUB...');
            log('Building EPUB file...');

            const epub = buildEpub(state.novelInfo, collectedChapters, removeIndent, coverData);
            
            updateProgress(100, 'Complete!');
            log(`EPUB created successfully! (${collectedChapters.length} chapters in ${elapsed}s)`, 'success');

            const filename = sanitizeFilename(state.novelInfo.title || 'novel') + '.epub';
            downloadBlob(epub, filename);
            log(`Downloaded: ${filename}`, 'success');
        }

    } catch (error) {
        log(`Fatal error: ${error.message}`, 'error');
        console.error('EPUB creation error:', error);
    } finally {
        state.isRunning = false;
        els.btnCreate.classList.remove('hidden');
        els.btnCancel.classList.add('hidden');
    }
}

function extractChapterContent(doc, config, removeIndent = false) {
    // Try site-specific content selectors
    for (const sel of config.contentSelectors) {
        const el = doc.querySelector(sel);
        if (el) {
            const clone = el.cloneNode(true);
            
            // Remove unwanted elements
            const removeSelectors = [
                'script', 'style', 'iframe', 'noscript',
                '.ads', '.ad', '.advertisement', '.adsbygoogle',
                '.nav', '.navigation', '.menu',
                '.comments', '.comment-section', '#comments',
                '.share', '.social', '.sharing',
                '.related', '.recommended',
                '.author-note', '.translator-note',
                '[id*="google"]', '[class*="sponsor"]'
            ];
            removeSelectors.forEach(s => {
                clone.querySelectorAll(s).forEach(e => e.remove());
            });
            
            // Decrypt if needed (ChrysanthemumGarden)
            if (config.hasEncryption) {
                decryptContent(clone);
            }
            
            // Clean up the HTML for EPUB compatibility
            return cleanHtmlForEpub(clone.innerHTML, removeIndent);
        }
    }
    
    return '<p>Content not found</p>';
}

// Clean HTML for EPUB - fix entities, remove problematic elements
function cleanHtmlForEpub(html, removeIndent = false) {
    // Normalize apostrophes FIRST for consistent matching
    html = html.replace(/[''`´]/g, "'");
    
    // AGGRESSIVE watermark removal - catches ALL variations
    const watermarkPatterns = [
        // "Please don't forget to author" - all possible variations
        /Please\s+don'?t\s+forget\s+to\s+author\.?/gi,
        /Please\s+don.?t\s+forget\s+to\s+author\.?/gi,
        /don'?t\s+forget\s+to\s+author\.?/gi,
        /don.?t\s+forget\s+to\s+author\.?/gi,
        /forget\s+to\s+author\.?/gi,
        /Please\s+don'?t\s+forget\s+to\s+.*?(author|support|vote|comment|rate)[^<.]*\.?/gi,
        /don'?t\s+forget\s+to\s+.*?(author|support|vote|comment|rate)[^<.]*\.?/gi,
        // ChrysanthemumGarden watermarks
        /Story\s+translated\s+by.*?Chrysanthemum\s*Garden\.?/gi,
        /translated\s+by.*?Chrysanthemum\s*Garden\.?/gi,
        /Chrysanthemum\s*Garden\.?/gi,
        /chrysanthemumgarden\.com/gi,
        /chrysanthemumgarden/gi,
        // Support messages
        /Please\s+support\s+our\s+translators.*$/gim,
        /support\s+our\s+translators.*$/gim,
        /Read\s+more\s+BL\s+at.*$/gim,
        /Read\s+more\s+at.*$/gim,
        /Please\s+visit.*chrysanthemumgarden.*$/gim,
        /visit.*chrysanthemumgarden.*$/gim,
        // "Please visit (dot) com" style obfuscated watermarks
        /Please\s+visit\s*\([^)]*\)\s*com\.?/gi,
        /Please\s+visit\s*\(dot\)\s*com\.?/gi,
        /visit\s*\([^)]*\)\s*com\.?/gi,
        // Generic "please visit" watermarks (standalone lines)
        /^\s*Please\s+visit\s*$/gim,
        /^\s*Please\s+visit\s+[^\s]+\s*$/gim,
        // TL/Author notes
        /^T\/N:.*$/gim,
        /^TL:.*$/gim,
        /^A\/N:.*$/gim,
        /^E\/N:.*$/gim,
    ];
    
    for (const pattern of watermarkPatterns) {
        html = html.replace(pattern, '');
    }
    
    // Remove paragraphs that contain ONLY watermark-like content
    html = html.replace(/<p[^>]*>\s*(Please\s+don.?t\s+forget[^<]*|forget\s+to\s+author[^<]*|Chrysanthemum\s*Garden\.?|Story\s+translated[^<]*|Please\s+support[^<]*|Read\s+more[^<]*|Please\s+visit[^<]*)\s*<\/p>/gi, '');
    
    // ============ 5-6 CHAR GARBAGE REMOVAL ============
    // CG appends 5-6 character mixed-case alphanumeric garbage at end of paragraphs
    // 6-char examples: bFdfV8, Xp124w, SjAW8M, y1uKUo, Y5Bf0o, UdgwVx, QeJxmC, Wvgjy1
    // 5-char examples: Nkv1I, aB3cD (must have mixed case OR numbers with letters)
    // Also handles SPACED variants: "0ep PY", "CDyO Y" (space in the middle)
    // Pattern: whitespace/nbsp + exactly 5-6 alphanumeric chars (must have both upper/lower or numbers)
    // These appear at END of text blocks, before </p> or at end of string
    
    // Remove SPACED garbage patterns first (e.g., "0ep PY", "CDyO Y" - 3-4 chars + space + 1-3 chars)
    html = html.replace(/[\s\u00A0]+[A-Za-z0-9]{2,4}\s[A-Za-z0-9]{1,3}(<\/p>)/gi, (match, closing) => {
        // Verify it looks like garbage (mixed case/numbers, short)
        const code = match.replace(/[\s\u00A0]+/g, ' ').replace(/<\/p>/i, '').trim();
        const hasUpper = /[A-Z]/.test(code);
        const hasLower = /[a-z]/.test(code);
        const hasNumber = /\d/.test(code);
        const isGarbage = (hasUpper && hasLower) || (hasNumber && (hasUpper || hasLower));
        if (isGarbage && code.length <= 8) {
            console.log(`[Cleanup] Removed spaced garbage: "${code}"`);
            return closing;
        }
        return match;
    });
    
    // Remove spaced garbage at end of line (no closing tag)
    html = html.replace(/[\s\u00A0]+[A-Za-z0-9]{2,4}\s[A-Za-z0-9]{1,3}$/gm, (match) => {
        const code = match.trim();
        const hasUpper = /[A-Z]/.test(code);
        const hasLower = /[a-z]/.test(code);
        const hasNumber = /\d/.test(code);
        const isGarbage = (hasUpper && hasLower) || (hasNumber && (hasUpper || hasLower));
        if (isGarbage && code.length <= 8) {
            console.log(`[Cleanup] Removed spaced garbage (EOL): "${code}"`);
            return '';
        }
        return match;
    });
    
    // Remove 5-6 char garbage at end of paragraphs (before </p>)
    html = html.replace(/[\s\u00A0]+[A-Za-z0-9]{5,6}(<\/p>)/gi, (match, closing) => {
        // Extract the 5-6 char code
        const code = match.replace(/[\s\u00A0]+/g, '').replace(/<\/p>/i, '');
        // Verify it's actually garbage: must have mixed case OR numbers with letters
        const hasUpper = /[A-Z]/.test(code);
        const hasLower = /[a-z]/.test(code);
        const hasNumber = /\d/.test(code);
        const isGarbage = (hasUpper && hasLower) || (hasNumber && (hasUpper || hasLower));
        if (isGarbage) {
            console.log(`[Cleanup] Removed 5-6 char garbage: "${code}"`);
            return closing; // Keep just the closing tag
        }
        return match; // Keep original if it's a real word
    });
    
    // Also remove 5-6 char garbage at absolute end of text content (no closing tag)
    html = html.replace(/[\s\u00A0]+[A-Za-z0-9]{5,6}$/gm, (match) => {
        const code = match.trim();
        const hasUpper = /[A-Z]/.test(code);
        const hasLower = /[a-z]/.test(code);
        const hasNumber = /\d/.test(code);
        const isGarbage = (hasUpper && hasLower) || (hasNumber && (hasUpper || hasLower));
        if (isGarbage) {
            console.log(`[Cleanup] Removed 5-6 char garbage (EOL): "${code}"`);
            return ''; // Remove it
        }
        return match;
    });
    
    // Remove legacy patterns (5-7 char specific patterns)
    html = html.replace(/\s+[A-Z][a-z][A-Z0-9][a-z][A-Z][a-z0-9](?=[\s.,!?<]|$)/g, '');
    html = html.replace(/\s+[a-z][A-Z0-9][a-z][A-Z][a-z][A-Z0-9](?=[\s.,!?<]|$)/g, '');
    
    // Replace &nbsp; with proper space or &#160;
    html = html.replace(/&nbsp;/g, '&#160;');
    
    // Fix other common entity issues
    html = html.replace(/&ldquo;/g, '"');
    html = html.replace(/&rdquo;/g, '"');
    html = html.replace(/&lsquo;/g, "'");
    html = html.replace(/&rsquo;/g, "'");
    html = html.replace(/&mdash;/g, '—');
    html = html.replace(/&ndash;/g, '–');
    html = html.replace(/&hellip;/g, '…');
    html = html.replace(/&amp;/g, '&');
    html = html.replace(/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;');
    
    // Remove inline styles that might cause issues
    html = html.replace(/\s*style="[^"]*"/gi, '');
    
    // Remove empty paragraphs
    html = html.replace(/<p[^>]*>\s*<\/p>/gi, '');
    
    // Remove paragraph indentation if requested
    if (removeIndent) {
        // Remove leading tabs and spaces from paragraph content
        html = html.replace(/<p([^>]*)>[\t ]+/gi, '<p$1>');
        // Remove &nbsp; at start of paragraphs  
        html = html.replace(/<p([^>]*)>(&#160;|&nbsp;)+/gi, '<p$1>');
        // Remove text-indent style
        html = html.replace(/text-indent:\s*[^;]+;?/gi, '');
    }
    
    // Remove garbage codes that look like: tyBig9, qYUpnS, PG7fFs (short alphanumeric mixed case with numbers)
    // These appear as standalone paragraphs
    html = html.replace(/<p[^>]*>\s*[a-zA-Z0-9]{4,12}\s*<\/p>/gi, (match) => {
        const content = match.replace(/<\/?p[^>]*>/gi, '').trim();
        // Check if it's a garbage code (mixed case letters + numbers, short)
        if (/^[a-zA-Z0-9]+$/.test(content) && /[A-Z]/.test(content) && /[a-z]/.test(content) && /\d/.test(content)) {
            return ''; // Remove it
        }
        return match; // Keep it
    });
    
    // Convert <br> to proper XHTML
    html = html.replace(/<br\s*>/gi, '<br/>');
    html = html.replace(/<br\s*\/?\s*>/gi, '<br/>');
    
    // Convert <hr> to proper XHTML (self-closing)
    html = html.replace(/<hr\s*>/gi, '<hr/>');
    html = html.replace(/<hr\s*\/?\s*>/gi, '<hr/>');
    
    // Fix <img> tags to be self-closing
    html = html.replace(/<img([^>]*)(?<!\/)>/gi, '<img$1/>');
    
    // Remove any remaining problematic attributes
    html = html.replace(/\s*onclick="[^"]*"/gi, '');
    html = html.replace(/\s*onload="[^"]*"/gi, '');
    
    return html;
}

function decryptContent(root) {
    let count = 0;
    
    // Method 1: Try selector-based decryption (for elements with specific classes/styles)
    for (const [selector, table] of cipherTables) {
        try {
            root.querySelectorAll(selector).forEach(el => {
                const orig = el.textContent;
                const decrypted = orig.split('').map(c => table.get(c) || c).join('');
                const textNode = document.createTextNode(decrypted);
                el.parentNode.replaceChild(textNode, el);
                count++;
            });
        } catch (e) {}
    }
    
    // Method 2: Try generic .jum class
    try {
        root.querySelectorAll('.jum').forEach(el => {
            const table = cipherTables.get('span.jum');
            if (table) {
                const orig = el.textContent;
                const decrypted = orig.split('').map(c => table.get(c) || c).join('');
                const textNode = document.createTextNode(decrypted);
                el.parentNode.replaceChild(textNode, el);
                count++;
            }
        });
    } catch (e) {}
    
    // Method 3: Apply decryption to ALL text nodes if content looks encrypted
    // This handles cases where CG serves pre-encrypted text without span wrappers
    if (count === 0) {
        count = decryptAllTextNodes(root);
    }
    
    return count;
}

// Decrypt text using the master cipher table
function decryptText(text) {
    return text.split('').map(c => masterDecryptTable.get(c) || c).join('');
}

// Check if text looks encrypted (has unusual letter patterns for English)
function looksEncrypted(text) {
    if (!text || text.length < 20) return false;
    
    // Count how many characters would change with decryption
    let changes = 0;
    let letters = 0;
    for (const c of text) {
        if (/[a-zA-Z]/.test(c)) {
            letters++;
            if (masterDecryptTable.has(c) && masterDecryptTable.get(c) !== c) {
                changes++;
            }
        }
    }
    
    // If more than 30% of letters would change, it's likely encrypted
    return letters > 10 && (changes / letters) > 0.3;
}

// Fetch cover image and return as base64 data
async function fetchCoverImage(url) {
    if (!url) return null;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const blob = await response.blob();
        const mimeType = blob.type || 'image/jpeg';
        
        // Determine file extension
        let ext = 'jpg';
        if (mimeType.includes('png')) ext = 'png';
        else if (mimeType.includes('gif')) ext = 'gif';
        else if (mimeType.includes('webp')) ext = 'webp';
        
        // Convert to array buffer
        const arrayBuffer = await blob.arrayBuffer();
        
        return {
            data: new Uint8Array(arrayBuffer),
            mimeType: mimeType,
            ext: ext
        };
    } catch (e) {
        console.error('Cover fetch error:', e);
        return null;
    }
}

// Decrypt all text nodes in the DOM tree
function decryptAllTextNodes(root) {
    let count = 0;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    const nodesToProcess = [];
    
    // Collect all text nodes first
    let node;
    while (node = walker.nextNode()) {
        if (node.textContent.trim().length > 10) {
            nodesToProcess.push(node);
        }
    }
    
    // Process each text node
    for (const textNode of nodesToProcess) {
        const orig = textNode.textContent;
        if (looksEncrypted(orig)) {
            const decrypted = decryptText(orig);
            if (decrypted !== orig) {
                textNode.textContent = decrypted;
                count++;
            }
        }
    }
    
    return count;
}

function cancelCreation() {
    state.cancelled = true;
    log('Cancelling...', 'error');
}

// ============ EPUB BUILDING ============
function buildEpub(novelInfo, chapters, removeIndent = true, coverData = null) {
    const files = [];
    
    // mimetype (must be first, uncompressed)
    files.push({ name: 'mimetype', content: 'application/epub+zip', compress: false });
    
    // container.xml
    files.push({
        name: 'META-INF/container.xml',
        content: `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`
    });
    
    // Generate chapter files
    const manifestItems = [];
    const spineItems = [];
    const tocItems = [];
    
    // Add cover image if provided
    let hasCover = false;
    if (coverData && coverData.data) {
        hasCover = true;
        const coverFilename = `cover.${coverData.ext}`;
        
        // Add cover image file
        files.push({
            name: `OEBPS/${coverFilename}`,
            content: coverData.data,
            binary: true
        });
        
        // Add cover page XHTML
        files.push({
            name: 'OEBPS/cover.xhtml',
            content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title>Cover</title>
  <style type="text/css">
    body { margin: 0; padding: 0; text-align: center; }
    img { max-width: 100%; max-height: 100%; }
  </style>
</head>
<body>
  <div><img src="${coverFilename}" alt="Cover"/></div>
</body>
</html>`
        });
        
        manifestItems.push(`<item id="cover-image" href="${coverFilename}" media-type="${coverData.mimeType}" properties="cover-image"/>`);
        manifestItems.push('<item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>');
        spineItems.push('<itemref idref="cover"/>');
    }
    
    chapters.forEach((ch, i) => {
        const id = `chapter-${i}`;
        const filename = `${id}.xhtml`;
        
        files.push({
            name: `OEBPS/${filename}`,
            content: wrapChapterXhtml(ch.title, ch.content)
        });
        
        manifestItems.push(`<item id="${id}" href="${filename}" media-type="application/xhtml+xml"/>`);
        spineItems.push(`<itemref idref="${id}"/>`);
        tocItems.push({ id, title: ch.title, href: filename });
    });
    
    // nav.xhtml (EPUB3 TOC)
    files.push({
        name: 'OEBPS/nav.xhtml',
        content: buildNavXhtml(tocItems)
    });
    manifestItems.push('<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>');
    
    // toc.ncx (EPUB2 TOC)
    files.push({
        name: 'OEBPS/toc.ncx',
        content: buildTocNcx(novelInfo.title, tocItems)
    });
    manifestItems.push('<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>');
    
    // stylesheet
    files.push({
        name: 'OEBPS/style.css',
        content: getStylesheet(removeIndent)
    });
    manifestItems.push('<item id="css" href="style.css" media-type="text/css"/>');
    
    // content.opf
    files.push({
        name: 'OEBPS/content.opf',
        content: buildContentOpf(novelInfo, manifestItems, spineItems)
    });
    
    return createEpubZip(files);
}

function wrapChapterXhtml(title, content) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title>${escapeXml(title)}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <section epub:type="chapter">
    <h1>${escapeXml(title)}</h1>
    ${content}
  </section>
</body>
</html>`;
}

function buildNavXhtml(items) {
    const navItems = items.map(item => 
        `<li><a href="${item.href}">${escapeXml(item.title)}</a></li>`
    ).join('\n      ');
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <title>Table of Contents</title>
</head>
<body>
  <nav epub:type="toc">
    <h1>Table of Contents</h1>
    <ol>
      ${navItems}
    </ol>
  </nav>
</body>
</html>`;
}

function buildTocNcx(title, items) {
    const navPoints = items.map((item, i) => `
    <navPoint id="navpoint-${i}" playOrder="${i + 1}">
      <navLabel><text>${escapeXml(item.title)}</text></navLabel>
      <content src="${item.href}"/>
    </navPoint>`).join('');
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="novel-epub-${Date.now()}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>${escapeXml(title)}</text></docTitle>
  <navMap>${navPoints}
  </navMap>
</ncx>`;
}

function buildContentOpf(novelInfo, manifestItems, spineItems) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="BookId">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="BookId">novel-epub-${Date.now()}</dc:identifier>
    <dc:title>${escapeXml(novelInfo.title || 'Unknown')}</dc:title>
    <dc:creator>${escapeXml(novelInfo.author || 'Unknown')}</dc:creator>
    <dc:language>en</dc:language>
    <meta property="dcterms:modified">${new Date().toISOString().split('.')[0]}Z</meta>
  </metadata>
  <manifest>
    ${manifestItems.join('\n    ')}
  </manifest>
  <spine toc="ncx">
    ${spineItems.join('\n    ')}
  </spine>
</package>`;
}

function getStylesheet(removeIndent = true) {
    // Beautiful, modern EPUB stylesheet
    return `/* Modern Novel Stylesheet */
@page {
  margin: 1.5em;
}

body {
  font-family: "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif;
  font-size: 1.1em;
  line-height: 1.8;
  color: #1a1a1a;
  background-color: #fefefe;
  padding: 0.5em 1.5em;
  max-width: 40em;
  margin: 0 auto;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  word-wrap: break-word;
  hyphens: auto;
  -webkit-hyphens: auto;
}

/* Chapter Title */
h1, h2 {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
  margin: 1.5em 0 1em 0;
  padding-bottom: 0.5em;
  border-bottom: 2px solid #e0e0e0;
  letter-spacing: 0.02em;
}

h1 {
  font-size: 1.5em;
}

h2 {
  font-size: 1.3em;
}

/* Paragraphs - Clean, no indent by default */
p {
  margin: 0.9em 0;
  text-indent: ${removeIndent ? '0' : '1.5em'};
  text-align: justify;
}

p:first-of-type {
  text-indent: 0;
}

/* Emphasis and Strong */
em, i {
  font-style: italic;
}

strong, b {
  font-weight: 600;
}

/* Links */
a {
  color: #3498db;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Block quotes for author notes etc */
blockquote {
  margin: 1.5em 1em;
  padding: 0.8em 1em;
  border-left: 4px solid #3498db;
  background-color: #f8f9fa;
  font-style: italic;
  color: #555;
}

/* Horizontal rule / scene break */
hr {
  border: none;
  height: 1px;
  background: linear-gradient(to right, transparent, #ccc, transparent);
  margin: 2em auto;
  width: 60%;
}

/* Prevent orphans and widows */
p {
  orphans: 2;
  widows: 2;
}

/* Image handling */
img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1em auto;
}

/* Small text / notes */
small, .note {
  font-size: 0.9em;
  color: #666;
}
`;
}

// ============ ZIP CREATION ============
function createEpubZip(files) {
    const parts = [];
    const centralDirectory = [];
    let offset = 0;

    for (const file of files) {
        const filename = new TextEncoder().encode(file.name);
        const content = typeof file.content === 'string' 
            ? new TextEncoder().encode(file.content) 
            : file.content;

        const crc = crc32(content);
        
        // Local file header
        const localHeader = new Uint8Array(30 + filename.length);
        const view = new DataView(localHeader.buffer);
        
        view.setUint32(0, 0x04034b50, true);
        view.setUint16(4, 20, true);
        view.setUint16(6, 0, true);
        view.setUint16(8, 0, true); // store
        view.setUint16(10, 0, true);
        view.setUint16(12, 0, true);
        view.setUint32(14, crc, true);
        view.setUint32(18, content.length, true);
        view.setUint32(22, content.length, true);
        view.setUint16(26, filename.length, true);
        view.setUint16(28, 0, true);
        localHeader.set(filename, 30);
        
        parts.push(localHeader);
        parts.push(content);
        
        // Central directory entry
        const centralEntry = new Uint8Array(46 + filename.length);
        const centralView = new DataView(centralEntry.buffer);
        
        centralView.setUint32(0, 0x02014b50, true);
        centralView.setUint16(4, 20, true);
        centralView.setUint16(6, 20, true);
        centralView.setUint16(8, 0, true);
        centralView.setUint16(10, 0, true);
        centralView.setUint16(12, 0, true);
        centralView.setUint16(14, 0, true);
        centralView.setUint32(16, crc, true);
        centralView.setUint32(20, content.length, true);
        centralView.setUint32(24, content.length, true);
        centralView.setUint16(28, filename.length, true);
        centralView.setUint16(30, 0, true);
        centralView.setUint16(32, 0, true);
        centralView.setUint16(34, 0, true);
        centralView.setUint16(36, 0, true);
        centralView.setUint32(38, 0, true);
        centralView.setUint32(42, offset, true);
        centralEntry.set(filename, 46);
        
        centralDirectory.push(centralEntry);
        offset += localHeader.length + content.length;
    }
    
    const centralDirStart = offset;
    let centralDirSize = 0;
    for (const entry of centralDirectory) {
        parts.push(entry);
        centralDirSize += entry.length;
    }
    
    const endRecord = new Uint8Array(22);
    const endView = new DataView(endRecord.buffer);
    
    endView.setUint32(0, 0x06054b50, true);
    endView.setUint16(4, 0, true);
    endView.setUint16(6, 0, true);
    endView.setUint16(8, files.length, true);
    endView.setUint16(10, files.length, true);
    endView.setUint32(12, centralDirSize, true);
    endView.setUint32(16, centralDirStart, true);
    endView.setUint16(20, 0, true);
    
    parts.push(endRecord);
    
    const totalSize = parts.reduce((sum, p) => sum + p.length, 0);
    const result = new Uint8Array(totalSize);
    let pos = 0;
    for (const part of parts) {
        result.set(part, pos);
        pos += part.length;
    }
    
    return new Blob([result], { type: 'application/epub+zip' });
}

function crc32(data) {
    let crc = 0xFFFFFFFF;
    const table = getCrc32Table();
    for (let i = 0; i < data.length; i++) {
        crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xFF];
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

let crc32Table = null;
function getCrc32Table() {
    if (crc32Table) return crc32Table;
    crc32Table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) {
            c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        crc32Table[i] = c;
    }
    return crc32Table;
}

// ============ UTILITIES ============
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function escapeXml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeHtml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function sanitizeFilename(name) {
    return name
        .replace(/[<>:"/\\|?*]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 100);
}

async function downloadBlob(blob, filename) {
    // Android WebView bridge: save file natively when available.
    if (window.AndroidBridge && typeof window.AndroidBridge.saveBase64File === 'function') {
        try {
            const buffer = await blob.arrayBuffer();
            const bytes = new Uint8Array(buffer);
            const chunkSize = 0x8000;
            let binary = '';

            for (let i = 0; i < bytes.length; i += chunkSize) {
                const chunk = bytes.subarray(i, i + chunkSize);
                binary += String.fromCharCode(...chunk);
            }

            const base64 = btoa(binary);
            const mimeType = blob.type || 'application/octet-stream';
            window.AndroidBridge.saveBase64File(filename, mimeType, base64);
            return;
        } catch (error) {
            console.error('Android bridge save failed, falling back to browser download:', error);
        }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 60000);
}

// ============ START ============
document.addEventListener('DOMContentLoaded', init);
