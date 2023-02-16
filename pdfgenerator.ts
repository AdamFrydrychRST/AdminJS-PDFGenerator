
import { RecordJSON } from 'adminjs'
import { jsPDF } from 'jspdf'

const pdfGenerator = (record: RecordJSON): string => {
  const { params } = record
  const doc = new jsPDF()
  doc.text(params.title, 10, 10)
  doc.text(params.year.toString(), 150, 10)
  const filename = `/${params.id}.pdf`
  doc.save(`./pdfs${filename}`)
  return filename
}

export default pdfGenerator
