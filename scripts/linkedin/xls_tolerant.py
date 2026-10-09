# Apertura tolerante de los .xls de LinkedIn.
#
# xlrd falla con UnicodeDecodeError en algunos exports de contenido cuando un
# texto (típicamente un emoji, que en UTF-16 ocupa dos unidades) queda partido
# entre dos registros internos del archivo. Los números no se ven afectados:
# solo ese carácter. Si la apertura normal falla, se reintenta reemplazando
# el carácter ilegible (U+FFFD) y después se lo quita de los textos.
import xlrd
import xlrd.book


def open_xls(path):
    try:
        return xlrd.open_workbook(path)
    except UnicodeDecodeError:
        original = xlrd.book.unicode
        xlrd.book.unicode = lambda b, enc: b.decode(enc, 'replace').replace('�', '')
        try:
            return xlrd.open_workbook(path)
        finally:
            xlrd.book.unicode = original
