import AdminJS, { ComponentLoader } from 'adminjs'
import express from 'express'
import AdminJSExpress from '@adminjs/express'
import Adapter, { Database, Resource } from '@adminjs/sql'
import importExportFeature from '@adminjs/import-export'
import { pdfHandler } from './pdfHandler'
import path from 'path'

const PORT = 3001

// We'll need to register the SQL Adapter
AdminJS.registerAdapter({
  Database,
  Resource
})

const start = async (): Promise<void> => {
  const app = express()

  // This facilitates the connection to the postgres database
  const db = await new Adapter('postgresql', {
    connectionString: 'postgresql://postgres:example@localhost:5432/Charts',
    database: 'Charts'
  }).init()

  const userMenu = {
    name: 'TestMenu',
    icon: 'Document'
  }

  // Component loader
  const componentLoader = new ComponentLoader()

  const Components = {
    PDFGenerator: componentLoader.add('GeneratePDF', './pdfgenerator.component')
  }

  // We will need to create an instance of AdminJS with a basic resource fetched
  const admin = new AdminJS({
    resources: [
      {
        resource: db.table('movies'),
        features: [
          importExportFeature()
        ],
        options: {
          navigation: userMenu,
          properties: {
            id: { isVisible: false }
          },
          actions: {
            PDFGenerator: {
              actionType: 'record',
              icon: 'GeneratePdf',
              component: Components.PDFGenerator,
              handler: pdfHandler
            }
          }
        }
      }
    ],
    componentLoader
  })

  app.use(express.static(path.join(__dirname, 'pdfs/')))

  const adminRouter = AdminJSExpress.buildRouter(admin)
  app.use(admin.options.rootPath, adminRouter)

  app.listen(PORT, () => {
    console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`)
  })
}

start()
