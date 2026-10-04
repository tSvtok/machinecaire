const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'MachineCare API',
    version: '1.0.0',
    description: 'Documentation OpenAPI / Swagger pour l\'API MachineCare (gestion de machines et signalements de pannes).',
  },
  servers: [
    {
      url: '/',
      description: 'Serveur courant',
    },
    {
      url: 'http://localhost:3000',
      description: 'Serveur local de développement',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentification (inscription, connexion)' },
    { name: 'Users', description: 'Gestion des profils utilisateurs' },
    { name: 'Machines', description: 'Gestion du parc de machines' },
    { name: 'Signalements', description: 'Signalements d\'incidents et résolution' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Entrez votre token JWT généré lors du login ou register (ex: Bearer <token>)',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'fail' },
          message: { type: 'string', example: 'Description de l\'erreur' },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '6520b7c1a8d1e23f456789a1' },
          email: { type: 'string', format: 'email', example: 'admin@machine.com' },
          name: { type: 'string', example: 'Admin User' },
          role: { type: 'string', enum: ['user', 'admin'], example: 'admin' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Machine: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '6520b7c1a8d1e23f456789b2' },
          reference: { type: 'string', example: 'CNC-001' },
          name: { type: 'string', example: 'Fraiseuse Numérique CNC' },
          atelier: { type: 'string', example: 'Atelier Usinage A' },
          etat: {
            type: 'string',
            enum: ['operationel', 'maintenance', 'out_of_order'],
            example: 'operationel',
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Signalement: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '6520b7c1a8d1e23f456789c3' },
          machine: {
            oneOf: [
              { type: 'string', example: '6520b7c1a8d1e23f456789b2' },
              {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  reference: { type: 'string' },
                  name: { type: 'string' },
                },
              },
            ],
          },
          description: { type: 'string', example: 'Bruit anormal au démarrage du moteur' },
          declarePar: {
            oneOf: [
              { type: 'string', example: '6520b7c1a8d1e23f456789a1' },
              {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                },
              },
            ],
          },
          statut: {
            type: 'string',
            enum: ['ouvert', 'en_cours', 'resolu'],
            example: 'ouvert',
          },
          noteResolution: { type: 'string', nullable: true, example: null },
          dateResolution: { type: 'string', format: 'date-time', nullable: true, example: null },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Inscription d\'un nouvel utilisateur',
        description: 'Crée un nouveau compte utilisateur et renvoie un token JWT.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name'],
                properties: {
                  name: { type: 'string', example: 'John Doe' },
                  email: { type: 'string', format: 'email', example: 'john@example.com' },
                  password: { type: 'string', minLength: 6, example: 'secret123' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Utilisateur créé avec succès',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsIn...' },
                    data: {
                      type: 'object',
                      properties: {
                        user: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            email: { type: 'string' },
                            name: { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Champs manquants ou invalides',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          409: {
            description: 'Email déjà utilisé',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Connexion d\'un utilisateur',
        description: 'Authentifie un utilisateur avec ses identifiants et renvoie un token JWT.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'admin@machine.com' },
                  password: { type: 'string', example: 'admin123' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Connexion réussie',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsIn...' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Email ou mot de passe manquant',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          401: {
            description: 'Identifiants invalides',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },
    '/api/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Obtenir le profil de l\'utilisateur connecté',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Détails du compte connecté',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Token manquant ou invalide',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          404: {
            description: 'Utilisateur non trouvé',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Mettre à jour le profil de l\'utilisateur connecté',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'John Updated' },
                  email: { type: 'string', format: 'email', example: 'newemail@example.com' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Profil mis à jour',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        user: { $ref: '#/components/schemas/User' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Token manquant ou invalide',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          404: {
            description: 'Utilisateur non trouvé',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },
    '/api/machines': {
      get: {
        tags: ['Machines'],
        summary: 'Lister les machines',
        description: 'Récupère la liste des machines avec filtres optionnels par atelier et état.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'atelier',
            in: 'query',
            description: 'Filtrer par nom d\'atelier',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'etat',
            in: 'query',
            description: 'Filtrer par état de la machine',
            required: false,
            schema: {
              type: 'string',
              enum: ['operationel', 'maintenance', 'out_of_order'],
            },
          },
        ],
        responses: {
          200: {
            description: 'Liste des machines récupérée avec succès',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    results: { type: 'integer', example: 2 },
                    data: {
                      type: 'object',
                      properties: {
                        machines: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Machine' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Non autorisé',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
      post: {
        tags: ['Machines'],
        summary: 'Créer une nouvelle machine',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['reference', 'name', 'atelier'],
                properties: {
                  reference: { type: 'string', example: 'ROBOT-01' },
                  name: { type: 'string', example: 'Bras Robotique Kuka' },
                  atelier: { type: 'string', example: 'Atelier Assemblage' },
                  etat: {
                    type: 'string',
                    enum: ['operationel', 'maintenance', 'out_of_order'],
                    default: 'operationel',
                    example: 'operationel',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Machine créée avec succès',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        machine: { $ref: '#/components/schemas/Machine' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Paramètres manquants ou invalides',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          401: {
            description: 'Non autorisé',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          409: {
            description: 'Référence de machine déjà existante',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },
    '/api/machines/{id}': {
      get: {
        tags: ['Machines'],
        summary: 'Détails d\'une machine',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identifiant ObjectId de la machine',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Détails de la machine trouvée',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        machine: { $ref: '#/components/schemas/Machine' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'ID invalide',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          401: {
            description: 'Non autorisé',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          404: {
            description: 'Machine non trouvée',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
      put: {
        tags: ['Machines'],
        summary: 'Mettre à jour une machine',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identifiant ObjectId de la machine',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  reference: { type: 'string', example: 'ROBOT-01-V2' },
                  name: { type: 'string', example: 'Bras Robotique Kuka V2' },
                  atelier: { type: 'string', example: 'Atelier Assemblage B' },
                  etat: {
                    type: 'string',
                    enum: ['operationel', 'maintenance', 'out_of_order'],
                    example: 'maintenance',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Machine mise à jour',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        machine: { $ref: '#/components/schemas/Machine' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Données invalides',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          401: {
            description: 'Non autorisé',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          404: {
            description: 'Machine non trouvée',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
      delete: {
        tags: ['Machines'],
        summary: 'Supprimer une machine',
        description: 'Supprime une machine si aucun signalement ne lui est rattaché.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identifiant ObjectId de la machine',
            schema: { type: 'string' },
          },
        ],
        responses: {
          204: {
            description: 'Machine supprimée avec succès (aucun contenu)',
          },
          401: {
            description: 'Non autorisé',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          404: {
            description: 'Machine non trouvée',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          409: {
            description: 'Impossible de supprimer : des signalements sont liés à cette machine',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },
    '/api/machines/{id}/signalements': {
      get: {
        tags: ['Machines'],
        summary: 'Historique des signalements d\'une machine',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identifiant ObjectId de la machine',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Historique des signalements de la machine',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    results: { type: 'integer', example: 1 },
                    data: {
                      type: 'object',
                      properties: {
                        signalements: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Signalement' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Non autorisé',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },
    '/api/signalements': {
      get: {
        tags: ['Signalements'],
        summary: 'Lister les signalements d\'incidents',
        description: 'Récupère tous les signalements avec possibilité de filtrer par machine ou statut.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'machine',
            in: 'query',
            description: 'Filtrer par ID de machine',
            required: false,
            schema: { type: 'string' },
          },
          {
            name: 'statut',
            in: 'query',
            description: 'Filtrer par statut',
            required: false,
            schema: {
              type: 'string',
              enum: ['ouvert', 'en_cours', 'resolu'],
            },
          },
        ],
        responses: {
          200: {
            description: 'Liste des signalements',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    results: { type: 'integer', example: 3 },
                    data: {
                      type: 'object',
                      properties: {
                        signalements: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Signalement' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Non autorisé',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
      post: {
        tags: ['Signalements'],
        summary: 'Créer un nouveau signalement',
        description: 'Signale un problème sur une machine. Le statut initial est "ouvert".',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['machine', 'description'],
                properties: {
                  machine: {
                    type: 'string',
                    description: 'ObjectId de la machine concernée',
                    example: '6520b7c1a8d1e23f456789b2',
                  },
                  description: {
                    type: 'string',
                    description: 'Description détaillée du problème rencontré',
                    example: 'Fuite d\'huile constatée sous le vérin principal',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Signalement créé avec succès',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        signalement: { $ref: '#/components/schemas/Signalement' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Champs manquants ou description vide',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          401: {
            description: 'Non autorisé',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          404: {
            description: 'Machine inexistante',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },
    '/api/signalements/{id}': {
      get: {
        tags: ['Signalements'],
        summary: 'Détails d\'un signalement',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identifiant ObjectId du signalement',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Détails du signalement',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        signalement: { $ref: '#/components/schemas/Signalement' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'ID invalide',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          401: {
            description: 'Non autorisé',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          404: {
            description: 'Signalement non trouvé',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
      put: {
        tags: ['Signalements'],
        summary: 'Modifier la description ou changer le statut',
        description: 'Permet de modifier la description ou de progresser dans le workflow (ex: ouvert → en_cours).',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identifiant ObjectId du signalement',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  description: { type: 'string', example: 'Mise à jour: la fuite s\'est aggravée' },
                  statut: {
                    type: 'string',
                    enum: ['ouvert', 'en_cours', 'resolu'],
                    example: 'en_cours',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Signalement mis à jour',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        signalement: { $ref: '#/components/schemas/Signalement' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Transition d\'état invalide ou champ incorrect',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          401: {
            description: 'Non autorisé',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          404: {
            description: 'Signalement non trouvé',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },
    '/api/signalements/{id}/resolve': {
      post: {
        tags: ['Signalements'],
        summary: 'Résoudre un signalement',
        description: 'Clôture un incident en passant son statut à "resolu" et en enregistrant une note explicative.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identifiant ObjectId du signalement',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['noteResolution'],
                properties: {
                  noteResolution: {
                    type: 'string',
                    example: 'Remplacement du joint d\'étanchéité et remise à niveau de l\'huile.',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Signalement résolu avec succès',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        signalement: { $ref: '#/components/schemas/Signalement' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Note de résolution manquante ou incident déjà résolu',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          401: {
            description: 'Non autorisé',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
          404: {
            description: 'Signalement non trouvé',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
          },
        },
      },
    },
  },
};

module.exports = swaggerDocument;
