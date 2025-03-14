import authdocs from '../docs/authdoc.doc';
import eventdocs from '../docs/event.doc';

const swaggerdocumentation = {
  openapi: '3.0.0',
  info: {
    title: 'Mentor Connect API Documentation',
    description: 'This is the mentor connect api documentation',
    version: '1.0.0',
  },
  servers: [
    {
      url: `${process.env.LOCALHOST_SERVER_URL}`,
      description: 'Localhost server',
    },
    {
      url: `${process.env.PRODUCTION_SERVER_URL}`,
      description: 'Production server'
    }
  ],
  tags: [
    {
      name: "Authentication",
      description: "Authentication related endpoints"
    },
    {
      name: "Event",
      description: "Event related endpoints"
    }
  ],
 
  paths: {
    ...authdocs,
    ...eventdocs
  }
};

export default swaggerdocumentation;