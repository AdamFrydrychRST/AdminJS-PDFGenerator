import pdfGenerator from './pdfgenerator'

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const pdfHandler = (request, response, context) => {
  const { record, currentAdmin } = context
  return {
    record: record.toJSON(currentAdmin),
    url: pdfGenerator(record.toJSON(currentAdmin))
  }
}
