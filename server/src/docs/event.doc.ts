// Request and Response Types
const EventRequest = {
  type: "object",
  required: ["title", "description", "date", "location"],
  properties: {
    title: {
      type: "string",
      description: "Event title",
      example: "Tech Workshop 2024"
    },
    description: {
      type: "string",
      description: "Detailed description of the event",
      example: "Join us for an interactive workshop on modern web technologies"
    },
    date: {
      type: "string",
      format: "date-time",
      description: "Event date and time",
      example: "2024-03-25T14:00:00Z"
    },
    location: {
      type: "string",
      description: "Event location or venue",
      example: "Tech Hub, Building A, Room 101"
    },
    capacity: {
      type: "number",
      description: "Maximum number of participants",
      example: 50
    },
    type: {
      type: "string",
      description: "Type of event",
      enum: ["workshop", "seminar", "networking", "other"],
      example: "workshop"
    },
    isOnline: {
      type: "boolean",
      description: "Whether the event is online or in-person",
      example: false
    },
    meetingLink: {
      type: "string",
      description: "Online meeting link (if isOnline is true)",
      example: "https://meet.google.com/abc-defg-hij"
    }
  }
};

const EventResponse = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
      example: true
    },
    message: {
      type: "string",
      example: "Event created successfully"
    },
    data: {
      type: "object",
      properties: {
        _id: {
          type: "string",
          example: "507f1f77bcf86cd799439011"
        },
        title: {
          type: "string",
          example: "Tech Workshop 2024"
        },
        description: {
          type: "string",
          example: "Join us for an interactive workshop on modern web technologies"
        },
        date: {
          type: "string",
          example: "2024-03-25T14:00:00Z"
        },
        location: {
          type: "string",
          example: "Tech Hub, Building A, Room 101"
        },
        organizer: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011"
            },
            firstName: {
              type: "string",
              example: "John"
            },
            lastName: {
              type: "string",
              example: "Doe"
            }
          }
        },
        participants: {
          type: "array",
          items: {
            type: "string"
          },
          description: "List of participant IDs",
          example: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
        },
        capacity: {
          type: "number",
          example: 50
        },
        type: {
          type: "string",
          example: "workshop"
        },
        isOnline: {
          type: "boolean",
          example: false
        },
        meetingLink: {
          type: "string",
          example: "https://meet.google.com/abc-defg-hij"
        },
        createdAt: {
          type: "string",
          example: "2024-03-20T10:00:00Z"
        },
        updatedAt: {
          type: "string",
          example: "2024-03-20T10:00:00Z"
        }
      }
    }
  }
};

// Create Event
const createEvent = {
  tags: ["Event"],
  description: "Create a new event",
  security: [{ bearerAuth: [] }],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: EventRequest
      }
    }
  },
  responses: {
    "201": {
      description: "Event created successfully",
      content: {
        "application/json": {
          schema: EventResponse
        }
      }
    },
    "400": {
      description: "Bad Request - Invalid input data",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                example: false
              },
              message: {
                type: "string",
                example: "Invalid input data"
              },
              error: {
                type: "string",
                example: "Title is required"
              }
            }
          }
        }
      }
    }
  }
};

// Get All Events
const getEvents = {
  tags: ["Event"],
  description: "Get all events",
  parameters: [
    {
      in: "query",
      name: "page",
      schema: {
        type: "integer",
        default: 1
      },
      description: "Page number for pagination"
    },
    {
      in: "query",
      name: "limit",
      schema: {
        type: "integer",
        default: 10
      },
      description: "Number of items per page"
    },
    {
      in: "query",
      name: "type",
      schema: {
        type: "string",
        enum: ["workshop", "seminar", "networking", "other"]
      },
      description: "Filter events by type"
    }
  ],
  responses: {
    "200": {
      description: "List of events retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                example: true
              },
              data: {
                type: "object",
                properties: {
                  events: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/EventResponse"
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      total: {
                        type: "number",
                        example: 50
                      },
                      pages: {
                        type: "number",
                        example: 5
                      },
                      page: {
                        type: "number",
                        example: 1
                      },
                      limit: {
                        type: "number",
                        example: 10
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

// Get Event by ID
const getEventById = {
  tags: ["Event"],
  description: "Get event details by ID",
  parameters: [
    {
      in: "path",
      name: "id",
      required: true,
      schema: {
        type: "string"
      },
      description: "Event ID"
    }
  ],
  responses: {
    "200": {
      description: "Event details retrieved successfully",
      content: {
        "application/json": {
          schema: EventResponse
        }
      }
    },
    "404": {
      description: "Event not found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                example: false
              },
              message: {
                type: "string",
                example: "Event not found"
              }
            }
          }
        }
      }
    }
  }
};

// Update Event
const updateEvent = {
  tags: ["Event"],
  description: "Update event details",
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      in: "path",
      name: "id",
      required: true,
      schema: {
        type: "string"
      },
      description: "Event ID"
    }
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: EventRequest
      }
    }
  },
  responses: {
    "200": {
      description: "Event updated successfully",
      content: {
        "application/json": {
          schema: EventResponse
        }
      }
    },
    "403": {
      description: "Forbidden - User is not the event organizer",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                example: false
              },
              message: {
                type: "string",
                example: "Not authorized to update this event"
              }
            }
          }
        }
      }
    }
  }
};

// Register for Event
const registerForEvent = {
  tags: ["Event"],
  description: "Register current user for an event",
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      in: "path",
      name: "id",
      required: true,
      schema: {
        type: "string"
      },
      description: "Event ID"
    }
  ],
  responses: {
    "200": {
      description: "Successfully registered for event",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                example: true
              },
              message: {
                type: "string",
                example: "Successfully registered for event"
              }
            }
          }
        }
      }
    },
    "400": {
      description: "Event is full or user already registered",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                example: false
              },
              message: {
                type: "string",
                example: "Event is already full"
              }
            }
          }
        }
      }
    }
  }
};

// Get User Events
const getUserEvents = {
  tags: ["Event"],
  description: "Get events that the current user is registered for",
  security: [{ bearerAuth: [] }],
  responses: {
    "200": {
      description: "User events retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                example: true
              },
              data: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/EventResponse"
                }
              }
            }
          }
        }
      }
    }
  }
};

const baseUrl = process.env.BASE_URL;
const eventdocs = {
  [`${baseUrl}/events`]: {
    post: createEvent,
    get: getEvents
  },
  [`${baseUrl}/events/{id}`]: {
    get: getEventById,
    put: updateEvent
  },
  [`${baseUrl}/events/{id}/register`]: {
    post: registerForEvent
  },
  [`${baseUrl}/events/my-events`]: {
    get: getUserEvents
  }
};

export default eventdocs;
