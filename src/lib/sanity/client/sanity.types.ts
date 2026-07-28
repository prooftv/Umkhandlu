[
  {
    name: 'sanity.imagePaletteSwatch',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'sanity.imagePaletteSwatch',
          },
        },
        background: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        foreground: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        population: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
        title: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'sanity.imagePalette',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'sanity.imagePalette',
          },
        },
        darkMuted: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'sanity.imagePaletteSwatch',
          },
          optional: true,
        },
        lightVibrant: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'sanity.imagePaletteSwatch',
          },
          optional: true,
        },
        darkVibrant: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'sanity.imagePaletteSwatch',
          },
          optional: true,
        },
        vibrant: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'sanity.imagePaletteSwatch',
          },
          optional: true,
        },
        dominant: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'sanity.imagePaletteSwatch',
          },
          optional: true,
        },
        lightMuted: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'sanity.imagePaletteSwatch',
          },
          optional: true,
        },
        muted: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'sanity.imagePaletteSwatch',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'sanity.imageDimensions',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'sanity.imageDimensions',
          },
        },
        height: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
        width: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
        aspectRatio: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'twitter',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'twitter',
          },
        },
        cardType: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        creator: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        site: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        handle: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'openGraph',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'openGraph',
          },
        },
        url: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        image: {
          type: 'objectAttribute',
          value: {
            type: 'object',
            attributes: {
              asset: {
                type: 'objectAttribute',
                value: {
                  type: 'object',
                  attributes: {
                    _ref: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                      },
                    },
                    _type: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                        value: 'reference',
                      },
                    },
                    _weak: {
                      type: 'objectAttribute',
                      value: {
                        type: 'boolean',
                      },
                      optional: true,
                    },
                  },
                  dereferencesTo: 'sanity.imageAsset',
                },
                optional: true,
              },
              hotspot: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageHotspot',
                },
                optional: true,
              },
              crop: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageCrop',
                },
                optional: true,
              },
              alt: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'image',
                },
              },
            },
          },
          optional: true,
        },
        title: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        description: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        siteName: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'metaTag',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'metaTag',
          },
        },
        metaAttributes: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
              rest: {
                type: 'inline',
                name: 'metaAttribute',
              },
            },
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'metaAttribute',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'metaAttribute',
          },
        },
        attributeKey: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        attributeType: {
          type: 'objectAttribute',
          value: {
            type: 'union',
            of: [
              {
                type: 'string',
                value: 'string',
              },
              {
                type: 'string',
                value: 'image',
              },
            ],
          },
          optional: true,
        },
        attributeValueImage: {
          type: 'objectAttribute',
          value: {
            type: 'object',
            attributes: {
              asset: {
                type: 'objectAttribute',
                value: {
                  type: 'object',
                  attributes: {
                    _ref: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                      },
                    },
                    _type: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                        value: 'reference',
                      },
                    },
                    _weak: {
                      type: 'objectAttribute',
                      value: {
                        type: 'boolean',
                      },
                      optional: true,
                    },
                  },
                  dereferencesTo: 'sanity.imageAsset',
                },
                optional: true,
              },
              hotspot: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageHotspot',
                },
                optional: true,
              },
              crop: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageCrop',
                },
                optional: true,
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'image',
                },
              },
            },
          },
          optional: true,
        },
        attributeValueString: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'menuItem',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'menuItem',
          },
        },
        text: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        type: {
          type: 'objectAttribute',
          value: {
            type: 'union',
            of: [
              {
                type: 'string',
                value: 'link',
              },
              {
                type: 'string',
                value: 'child-menu',
              },
            ],
          },
          optional: true,
        },
        link: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'link',
          },
          optional: true,
        },
        childMenu: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
              rest: {
                type: 'inline',
                name: 'menuItem',
              },
            },
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'button',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'button',
          },
        },
        variant: {
          type: 'objectAttribute',
          value: {
            type: 'union',
            of: [
              {
                type: 'string',
                value: 'default',
              },
              {
                type: 'string',
                value: 'secondary',
              },
              {
                type: 'string',
                value: 'outline',
              },
              {
                type: 'string',
                value: 'link',
              },
            ],
          },
          optional: true,
        },
        text: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        link: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'link',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'blockContent',
    type: 'type',
    value: {
      type: 'array',
      of: {
        type: 'union',
        of: [
          {
            type: 'object',
            attributes: {
              children: {
                type: 'objectAttribute',
                value: {
                  type: 'array',
                  of: {
                    type: 'object',
                    attributes: {
                      marks: {
                        type: 'objectAttribute',
                        value: {
                          type: 'array',
                          of: {
                            type: 'string',
                          },
                        },
                        optional: true,
                      },
                      text: {
                        type: 'objectAttribute',
                        value: {
                          type: 'string',
                        },
                        optional: true,
                      },
                      _type: {
                        type: 'objectAttribute',
                        value: {
                          type: 'string',
                          value: 'span',
                        },
                      },
                    },
                    rest: {
                      type: 'object',
                      attributes: {
                        _key: {
                          type: 'objectAttribute',
                          value: {
                            type: 'string',
                          },
                        },
                      },
                    },
                  },
                },
                optional: true,
              },
              style: {
                type: 'objectAttribute',
                value: {
                  type: 'union',
                  of: [
                    {
                      type: 'string',
                      value: 'normal',
                    },
                    {
                      type: 'string',
                      value: 'h2',
                    },
                    {
                      type: 'string',
                      value: 'h3',
                    },
                    {
                      type: 'string',
                      value: 'h4',
                    },
                    {
                      type: 'string',
                      value: 'blockquote',
                    },
                  ],
                },
                optional: true,
              },
              listItem: {
                type: 'objectAttribute',
                value: {
                  type: 'union',
                  of: [
                    {
                      type: 'string',
                      value: 'bullet',
                    },
                    {
                      type: 'string',
                      value: 'number',
                    },
                  ],
                },
                optional: true,
              },
              markDefs: {
                type: 'objectAttribute',
                value: {
                  type: 'array',
                  of: {
                    type: 'object',
                    attributes: {
                      customLink: {
                        type: 'objectAttribute',
                        value: {
                          type: 'inline',
                          name: 'link',
                        },
                        optional: true,
                      },
                      _type: {
                        type: 'objectAttribute',
                        value: {
                          type: 'string',
                          value: 'customLink',
                        },
                      },
                    },
                    rest: {
                      type: 'object',
                      attributes: {
                        _key: {
                          type: 'objectAttribute',
                          value: {
                            type: 'string',
                          },
                        },
                      },
                    },
                  },
                },
                optional: true,
              },
              level: {
                type: 'objectAttribute',
                value: {
                  type: 'number',
                },
                optional: true,
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'block',
                },
              },
            },
            rest: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
          {
            type: 'object',
            attributes: {
              asset: {
                type: 'objectAttribute',
                value: {
                  type: 'object',
                  attributes: {
                    _ref: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                      },
                    },
                    _type: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                        value: 'reference',
                      },
                    },
                    _weak: {
                      type: 'objectAttribute',
                      value: {
                        type: 'boolean',
                      },
                      optional: true,
                    },
                  },
                  dereferencesTo: 'sanity.imageAsset',
                },
                optional: true,
              },
              hotspot: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageHotspot',
                },
                optional: true,
              },
              crop: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageCrop',
                },
                optional: true,
              },
              alt: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'image',
                },
              },
            },
            rest: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        ],
      },
    },
  },
  {
    name: 'teamGrid',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'teamGrid',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        description: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        members: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'object',
              attributes: {
                _ref: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
                _type: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                    value: 'reference',
                  },
                },
                _weak: {
                  type: 'objectAttribute',
                  value: {
                    type: 'boolean',
                  },
                  optional: true,
                },
              },
              dereferencesTo: 'person',
              rest: {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'subscribe',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'subscribe',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        content: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'blockContent',
          },
          optional: true,
        },
        buttonText: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'stats',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'stats',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        items: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'object',
              attributes: {
                value: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                  optional: true,
                },
                label: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                  optional: true,
                },
              },
              rest: {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'sponsorGrid',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'sponsorGrid',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        description: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        filterType: {
          type: 'objectAttribute',
          value: {
            type: 'union',
            of: [
              {
                type: 'string',
                value: 'all',
              },
              {
                type: 'string',
                value: 'ngo',
              },
              {
                type: 'string',
                value: 'business',
              },
              {
                type: 'string',
                value: 'government',
              },
              {
                type: 'string',
                value: 'community',
              },
            ],
          },
          optional: true,
        },
        limit: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'richText',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'richText',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        content: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'blockContent',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'recordList',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'recordList',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        filterType: {
          type: 'objectAttribute',
          value: {
            type: 'union',
            of: [
              {
                type: 'string',
                value: 'all',
              },
              {
                type: 'string',
                value: 'agenda',
              },
              {
                type: 'string',
                value: 'minutes',
              },
              {
                type: 'string',
                value: 'resolution',
              },
              {
                type: 'string',
                value: 'land-allocation',
              },
              {
                type: 'string',
                value: 'dispute-resolution',
              },
              {
                type: 'string',
                value: 'public-notice',
              },
              {
                type: 'string',
                value: 'policy',
              },
              {
                type: 'string',
                value: 'report',
              },
              {
                type: 'string',
                value: 'external-resource',
              },
            ],
          },
          optional: true,
        },
        limit: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'quote',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'quote',
          },
        },
        text: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        author: {
          type: 'objectAttribute',
          value: {
            type: 'object',
            attributes: {
              _ref: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'reference',
                },
              },
              _weak: {
                type: 'objectAttribute',
                value: {
                  type: 'boolean',
                },
                optional: true,
              },
            },
            dereferencesTo: 'person',
          },
          optional: true,
        },
        authorName: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        authorRole: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        image: {
          type: 'objectAttribute',
          value: {
            type: 'object',
            attributes: {
              asset: {
                type: 'objectAttribute',
                value: {
                  type: 'object',
                  attributes: {
                    _ref: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                      },
                    },
                    _type: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                        value: 'reference',
                      },
                    },
                    _weak: {
                      type: 'objectAttribute',
                      value: {
                        type: 'boolean',
                      },
                      optional: true,
                    },
                  },
                  dereferencesTo: 'sanity.imageAsset',
                },
                optional: true,
              },
              hotspot: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageHotspot',
                },
                optional: true,
              },
              crop: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageCrop',
                },
                optional: true,
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'image',
                },
              },
            },
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'peopleGrid',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'peopleGrid',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        description: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        filterType: {
          type: 'objectAttribute',
          value: {
            type: 'union',
            of: [
              {
                type: 'string',
                value: 'all',
              },
              {
                type: 'string',
                value: 'inkosi',
              },
              {
                type: 'string',
                value: 'induna',
              },
              {
                type: 'string',
                value: 'council',
              },
              {
                type: 'string',
                value: 'youth',
              },
              {
                type: 'string',
                value: 'community',
              },
              {
                type: 'string',
                value: 'author',
              },
            ],
          },
          optional: true,
        },
        limit: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'programList',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'programList',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        description: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        filterStatus: {
          type: 'objectAttribute',
          value: {
            type: 'union',
            of: [
              {
                type: 'string',
                value: 'all',
              },
              {
                type: 'string',
                value: 'upcoming',
              },
              {
                type: 'string',
                value: 'active',
              },
              {
                type: 'string',
                value: 'completed',
              },
            ],
          },
          optional: true,
        },
        limit: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'process',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'process',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        description: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        steps: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'object',
              attributes: {
                title: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                  optional: true,
                },
                description: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                  optional: true,
                },
              },
              rest: {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          optional: true,
        },
        footnote: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'organogram',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'organogram',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        description: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        inkosi: {
          type: 'objectAttribute',
          value: {
            type: 'object',
            attributes: {
              _ref: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'reference',
                },
              },
              _weak: {
                type: 'objectAttribute',
                value: {
                  type: 'boolean',
                },
                optional: true,
              },
            },
            dereferencesTo: 'person',
          },
          optional: true,
        },
        izinduna: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'object',
              attributes: {
                _ref: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
                _type: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                    value: 'reference',
                  },
                },
                _weak: {
                  type: 'objectAttribute',
                  value: {
                    type: 'boolean',
                  },
                  optional: true,
                },
              },
              dereferencesTo: 'person',
              rest: {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          optional: true,
        },
        council: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'object',
              attributes: {
                _ref: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
                _type: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                    value: 'reference',
                  },
                },
                _weak: {
                  type: 'objectAttribute',
                  value: {
                    type: 'boolean',
                  },
                  optional: true,
                },
              },
              dereferencesTo: 'person',
              rest: {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'opportunityList',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'opportunityList',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        description: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        filterType: {
          type: 'objectAttribute',
          value: {
            type: 'union',
            of: [
              {
                type: 'string',
                value: 'all',
              },
              {
                type: 'string',
                value: 'job',
              },
              {
                type: 'string',
                value: 'training',
              },
              {
                type: 'string',
                value: 'bursary',
              },
              {
                type: 'string',
                value: 'funding',
              },
            ],
          },
          optional: true,
        },
        limit: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'noticeList',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'noticeList',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        numberOfNotices: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
        filterType: {
          type: 'objectAttribute',
          value: {
            type: 'union',
            of: [
              {
                type: 'string',
                value: 'all',
              },
              {
                type: 'string',
                value: 'meeting',
              },
              {
                type: 'string',
                value: 'announcement',
              },
              {
                type: 'string',
                value: 'alert',
              },
              {
                type: 'string',
                value: 'opportunity',
              },
            ],
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'logoGrid',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'logoGrid',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        description: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        sponsors: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'object',
              attributes: {
                _ref: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
                _type: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                    value: 'reference',
                  },
                },
                _weak: {
                  type: 'objectAttribute',
                  value: {
                    type: 'boolean',
                  },
                  optional: true,
                },
              },
              dereferencesTo: 'sponsor',
              rest: {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'listingGrid',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'listingGrid',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        description: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        filterType: {
          type: 'objectAttribute',
          value: {
            type: 'union',
            of: [
              {
                type: 'string',
                value: 'all',
              },
              {
                type: 'string',
                value: 'school',
              },
              {
                type: 'string',
                value: 'clinic',
              },
              {
                type: 'string',
                value: 'business',
              },
              {
                type: 'string',
                value: 'accommodation',
              },
              {
                type: 'string',
                value: 'church',
              },
              {
                type: 'string',
                value: 'facility',
              },
              {
                type: 'string',
                value: 'area',
              },
            ],
          },
          optional: true,
        },
        limit: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'gallery',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'gallery',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        description: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        images: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'object',
              attributes: {
                asset: {
                  type: 'objectAttribute',
                  value: {
                    type: 'object',
                    attributes: {
                      _ref: {
                        type: 'objectAttribute',
                        value: {
                          type: 'string',
                        },
                      },
                      _type: {
                        type: 'objectAttribute',
                        value: {
                          type: 'string',
                          value: 'reference',
                        },
                      },
                      _weak: {
                        type: 'objectAttribute',
                        value: {
                          type: 'boolean',
                        },
                        optional: true,
                      },
                    },
                    dereferencesTo: 'sanity.imageAsset',
                  },
                  optional: true,
                },
                hotspot: {
                  type: 'objectAttribute',
                  value: {
                    type: 'inline',
                    name: 'sanity.imageHotspot',
                  },
                  optional: true,
                },
                crop: {
                  type: 'objectAttribute',
                  value: {
                    type: 'inline',
                    name: 'sanity.imageCrop',
                  },
                  optional: true,
                },
                alt: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                  optional: true,
                },
                caption: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                  optional: true,
                },
                _type: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                    value: 'image',
                  },
                },
              },
              rest: {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'faq',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'faq',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        items: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'object',
              attributes: {
                question: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                  optional: true,
                },
                answer: {
                  type: 'objectAttribute',
                  value: {
                    type: 'inline',
                    name: 'blockContent',
                  },
                  optional: true,
                },
              },
              rest: {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'embed',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'embed',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        url: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        aspectRatio: {
          type: 'objectAttribute',
          value: {
            type: 'union',
            of: [
              {
                type: 'string',
                value: '16/9',
              },
              {
                type: 'string',
                value: '4/3',
              },
              {
                type: 'string',
                value: '1/1',
              },
            ],
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'divider',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'divider',
          },
        },
        height: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'contactForm',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'contactForm',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        description: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        showMap: {
          type: 'objectAttribute',
          value: {
            type: 'boolean',
          },
          optional: true,
        },
        mapEmbedUrl: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'cardGrid',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'cardGrid',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        content: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'blockContent',
          },
          optional: true,
        },
        cards: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'object',
              attributes: {
                heading: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                  optional: true,
                },
                content: {
                  type: 'objectAttribute',
                  value: {
                    type: 'inline',
                    name: 'blockContent',
                  },
                  optional: true,
                },
                _type: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                    value: 'card',
                  },
                },
              },
              rest: {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
              },
            },
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'card',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'card',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        content: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'blockContent',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'postList',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'postList',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        numberOfPosts: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'mediaText',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'mediaText',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        content: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'blockContent',
          },
          optional: true,
        },
        imagePosition: {
          type: 'objectAttribute',
          value: {
            type: 'union',
            of: [
              {
                type: 'string',
                value: 'left',
              },
              {
                type: 'string',
                value: 'right',
              },
            ],
          },
          optional: true,
        },
        image: {
          type: 'objectAttribute',
          value: {
            type: 'object',
            attributes: {
              asset: {
                type: 'objectAttribute',
                value: {
                  type: 'object',
                  attributes: {
                    _ref: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                      },
                    },
                    _type: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                        value: 'reference',
                      },
                    },
                    _weak: {
                      type: 'objectAttribute',
                      value: {
                        type: 'boolean',
                      },
                      optional: true,
                    },
                  },
                  dereferencesTo: 'sanity.imageAsset',
                },
                optional: true,
              },
              hotspot: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageHotspot',
                },
                optional: true,
              },
              crop: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageCrop',
                },
                optional: true,
              },
              alt: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'image',
                },
              },
            },
          },
          optional: true,
        },
        buttons: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
              rest: {
                type: 'inline',
                name: 'button',
              },
            },
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'hero',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'hero',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        text: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'blockContent',
          },
          optional: true,
        },
        image: {
          type: 'objectAttribute',
          value: {
            type: 'object',
            attributes: {
              asset: {
                type: 'objectAttribute',
                value: {
                  type: 'object',
                  attributes: {
                    _ref: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                      },
                    },
                    _type: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                        value: 'reference',
                      },
                    },
                    _weak: {
                      type: 'objectAttribute',
                      value: {
                        type: 'boolean',
                      },
                      optional: true,
                    },
                  },
                  dereferencesTo: 'sanity.imageAsset',
                },
                optional: true,
              },
              hotspot: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageHotspot',
                },
                optional: true,
              },
              crop: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageCrop',
                },
                optional: true,
              },
              alt: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'image',
                },
              },
            },
          },
          optional: true,
        },
        buttons: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
              rest: {
                type: 'inline',
                name: 'button',
              },
            },
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'cta',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'cta',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        text: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        buttons: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
              rest: {
                type: 'inline',
                name: 'button',
              },
            },
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'communityMap',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'communityMap',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        description: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        centerLat: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
        centerLng: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
        zoom: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
        filterType: {
          type: 'objectAttribute',
          value: {
            type: 'union',
            of: [
              {
                type: 'string',
                value: 'all',
              },
              {
                type: 'string',
                value: 'school',
              },
              {
                type: 'string',
                value: 'clinic',
              },
              {
                type: 'string',
                value: 'business',
              },
              {
                type: 'string',
                value: 'accommodation',
              },
              {
                type: 'string',
                value: 'church',
              },
              {
                type: 'string',
                value: 'facility',
              },
              {
                type: 'string',
                value: 'area',
              },
            ],
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'campaignList',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'campaignList',
          },
        },
        heading: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        description: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        filterType: {
          type: 'objectAttribute',
          value: {
            type: 'union',
            of: [
              {
                type: 'string',
                value: 'all',
              },
              {
                type: 'string',
                value: 'ad',
              },
              {
                type: 'string',
                value: 'activation',
              },
              {
                type: 'string',
                value: 'csr',
              },
            ],
          },
          optional: true,
        },
        filterStatus: {
          type: 'objectAttribute',
          value: {
            type: 'union',
            of: [
              {
                type: 'string',
                value: 'all',
              },
              {
                type: 'string',
                value: 'active',
              },
              {
                type: 'string',
                value: 'completed',
              },
            ],
          },
          optional: true,
        },
        limit: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'adBanner',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'adBanner',
          },
        },
        title: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        image: {
          type: 'objectAttribute',
          value: {
            type: 'object',
            attributes: {
              asset: {
                type: 'objectAttribute',
                value: {
                  type: 'object',
                  attributes: {
                    _ref: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                      },
                    },
                    _type: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                        value: 'reference',
                      },
                    },
                    _weak: {
                      type: 'objectAttribute',
                      value: {
                        type: 'boolean',
                      },
                      optional: true,
                    },
                  },
                  dereferencesTo: 'sanity.imageAsset',
                },
                optional: true,
              },
              hotspot: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageHotspot',
                },
                optional: true,
              },
              crop: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageCrop',
                },
                optional: true,
              },
              alt: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'image',
                },
              },
            },
          },
          optional: true,
        },
        sponsor: {
          type: 'objectAttribute',
          value: {
            type: 'object',
            attributes: {
              _ref: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'reference',
                },
              },
              _weak: {
                type: 'objectAttribute',
                value: {
                  type: 'boolean',
                },
                optional: true,
              },
            },
            dereferencesTo: 'sponsor',
          },
          optional: true,
        },
        sponsorName: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        link: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        startDate: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        endDate: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        size: {
          type: 'objectAttribute',
          value: {
            type: 'union',
            of: [
              {
                type: 'string',
                value: 'full',
              },
              {
                type: 'string',
                value: 'half',
              },
            ],
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'conflictLog',
    type: 'document',
    attributes: {
      _id: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _type: {
        type: 'objectAttribute',
        value: {
          type: 'string',
          value: 'conflictLog',
        },
      },
      _createdAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _updatedAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _rev: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      campaign: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            _ref: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'reference',
              },
            },
            _weak: {
              type: 'objectAttribute',
              value: {
                type: 'boolean',
              },
              optional: true,
            },
          },
          dereferencesTo: 'campaign',
        },
        optional: true,
      },
      field: {
        type: 'objectAttribute',
        value: {
          type: 'union',
          of: [
            {
              type: 'string',
              value: 'progress',
            },
            {
              type: 'string',
              value: 'phase',
            },
            {
              type: 'string',
              value: 'workforce',
            },
            {
              type: 'string',
              value: 'timeline',
            },
            {
              type: 'string',
              value: 'status',
            },
            {
              type: 'string',
              value: 'budget',
            },
            {
              type: 'string',
              value: 'other',
            },
          ],
        },
        optional: true,
      },
      conflictType: {
        type: 'objectAttribute',
        value: {
          type: 'union',
          of: [
            {
              type: 'string',
              value: 'numerical',
            },
            {
              type: 'string',
              value: 'status',
            },
            {
              type: 'string',
              value: 'time',
            },
            {
              type: 'string',
              value: 'workforce',
            },
            {
              type: 'string',
              value: 'political',
            },
          ],
        },
        optional: true,
      },
      claims: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'object',
            attributes: {
              source: {
                type: 'objectAttribute',
                value: {
                  type: 'union',
                  of: [
                    {
                      type: 'string',
                      value: 'engineer',
                    },
                    {
                      type: 'string',
                      value: 'municipality',
                    },
                    {
                      type: 'string',
                      value: 'pmu',
                    },
                    {
                      type: 'string',
                      value: 'contractor',
                    },
                    {
                      type: 'string',
                      value: 'clo',
                    },
                    {
                      type: 'string',
                      value: 'observation',
                    },
                  ],
                },
                optional: true,
              },
              value: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              date: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              evidence: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              evidenceFiles: {
                type: 'objectAttribute',
                value: {
                  type: 'array',
                  of: {
                    type: 'object',
                    attributes: {
                      asset: {
                        type: 'objectAttribute',
                        value: {
                          type: 'object',
                          attributes: {
                            _ref: {
                              type: 'objectAttribute',
                              value: {
                                type: 'string',
                              },
                            },
                            _type: {
                              type: 'objectAttribute',
                              value: {
                                type: 'string',
                                value: 'reference',
                              },
                            },
                            _weak: {
                              type: 'objectAttribute',
                              value: {
                                type: 'boolean',
                              },
                              optional: true,
                            },
                          },
                          dereferencesTo: 'sanity.fileAsset',
                        },
                        optional: true,
                      },
                      title: {
                        type: 'objectAttribute',
                        value: {
                          type: 'string',
                        },
                        optional: true,
                      },
                      _type: {
                        type: 'objectAttribute',
                        value: {
                          type: 'string',
                          value: 'file',
                        },
                      },
                    },
                    rest: {
                      type: 'object',
                      attributes: {
                        _key: {
                          type: 'objectAttribute',
                          value: {
                            type: 'string',
                          },
                        },
                      },
                    },
                  },
                },
                optional: true,
              },
            },
            rest: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        optional: true,
      },
      displayTruth: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      resolutionState: {
        type: 'objectAttribute',
        value: {
          type: 'union',
          of: [
            {
              type: 'string',
              value: 'pending',
            },
            {
              type: 'string',
              value: 'partial',
            },
            {
              type: 'string',
              value: 'resolved',
            },
            {
              type: 'string',
              value: 'escalated',
            },
          ],
        },
        optional: true,
      },
      escalationLevel: {
        type: 'objectAttribute',
        value: {
          type: 'union',
          of: [
            {
              type: 'string',
              value: 'operator',
            },
            {
              type: 'string',
              value: 'engineer',
            },
            {
              type: 'string',
              value: 'pmu',
            },
            {
              type: 'string',
              value: 'site_meeting',
            },
            {
              type: 'string',
              value: 'municipal',
            },
          ],
        },
        optional: true,
      },
      resolutionNote: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      detectedAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      resolvedAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
    },
  },
  {
    name: 'record',
    type: 'document',
    attributes: {
      _id: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _type: {
        type: 'objectAttribute',
        value: {
          type: 'string',
          value: 'record',
        },
      },
      _createdAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _updatedAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _rev: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      title: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      slug: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'slug',
        },
        optional: true,
      },
      recordType: {
        type: 'objectAttribute',
        value: {
          type: 'union',
          of: [
            {
              type: 'string',
              value: 'agenda',
            },
            {
              type: 'string',
              value: 'minutes',
            },
            {
              type: 'string',
              value: 'resolution',
            },
            {
              type: 'string',
              value: 'land-allocation',
            },
            {
              type: 'string',
              value: 'dispute-resolution',
            },
            {
              type: 'string',
              value: 'public-notice',
            },
            {
              type: 'string',
              value: 'policy',
            },
            {
              type: 'string',
              value: 'report',
            },
            {
              type: 'string',
              value: 'infrastructure-concern',
            },
            {
              type: 'string',
              value: 'project-outcome',
            },
            {
              type: 'string',
              value: 'community-decision',
            },
            {
              type: 'string',
              value: 'external-resource',
            },
          ],
        },
        optional: true,
      },
      date: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      summary: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      statusNote: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      status: {
        type: 'objectAttribute',
        value: {
          type: 'union',
          of: [
            {
              type: 'string',
              value: 'adopted',
            },
            {
              type: 'string',
              value: 'approved',
            },
            {
              type: 'string',
              value: 'pending',
            },
            {
              type: 'string',
              value: 'open',
            },
            {
              type: 'string',
              value: 'rejected',
            },
            {
              type: 'string',
              value: 'resolved',
            },
          ],
        },
        optional: true,
      },
      approvedBy: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            _ref: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'reference',
              },
            },
            _weak: {
              type: 'objectAttribute',
              value: {
                type: 'boolean',
              },
              optional: true,
            },
          },
          dereferencesTo: 'person',
        },
        optional: true,
      },
      content: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'blockContent',
        },
        optional: true,
      },
      originNotice: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            _ref: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'reference',
              },
            },
            _weak: {
              type: 'objectAttribute',
              value: {
                type: 'boolean',
              },
              optional: true,
            },
          },
          dereferencesTo: 'notice',
        },
        optional: true,
      },
      parentRecord: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            _ref: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'reference',
              },
            },
            _weak: {
              type: 'objectAttribute',
              value: {
                type: 'boolean',
              },
              optional: true,
            },
          },
          dereferencesTo: 'record',
        },
        optional: true,
      },
      evidence: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'object',
            attributes: {
              asset: {
                type: 'objectAttribute',
                value: {
                  type: 'object',
                  attributes: {
                    _ref: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                      },
                    },
                    _type: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                        value: 'reference',
                      },
                    },
                    _weak: {
                      type: 'objectAttribute',
                      value: {
                        type: 'boolean',
                      },
                      optional: true,
                    },
                  },
                  dereferencesTo: 'sanity.fileAsset',
                },
                optional: true,
              },
              title: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'file',
                },
              },
            },
            rest: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        optional: true,
      },
      externalUrl: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      source: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      relatedArea: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            _ref: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'reference',
              },
            },
            _weak: {
              type: 'objectAttribute',
              value: {
                type: 'boolean',
              },
              optional: true,
            },
          },
          dereferencesTo: 'listing',
        },
        optional: true,
      },
      relatedCampaign: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            _ref: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'reference',
              },
            },
            _weak: {
              type: 'objectAttribute',
              value: {
                type: 'boolean',
              },
              optional: true,
            },
          },
          dereferencesTo: 'campaign',
        },
        optional: true,
      },
      verificationNote: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
    },
  },
  {
    name: 'opportunity',
    type: 'document',
    attributes: {
      _id: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _type: {
        type: 'objectAttribute',
        value: {
          type: 'string',
          value: 'opportunity',
        },
      },
      _createdAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _updatedAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _rev: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      title: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      slug: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'slug',
        },
        optional: true,
      },
      opportunityType: {
        type: 'objectAttribute',
        value: {
          type: 'union',
          of: [
            {
              type: 'string',
              value: 'job',
            },
            {
              type: 'string',
              value: 'training',
            },
            {
              type: 'string',
              value: 'bursary',
            },
            {
              type: 'string',
              value: 'funding',
            },
          ],
        },
        optional: true,
      },
      description: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      organization: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      deadlineNote: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      deadline: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      link: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      image: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            asset: {
              type: 'objectAttribute',
              value: {
                type: 'object',
                attributes: {
                  _ref: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                  _type: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                      value: 'reference',
                    },
                  },
                  _weak: {
                    type: 'objectAttribute',
                    value: {
                      type: 'boolean',
                    },
                    optional: true,
                  },
                },
                dereferencesTo: 'sanity.imageAsset',
              },
              optional: true,
            },
            hotspot: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageHotspot',
              },
              optional: true,
            },
            crop: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageCrop',
              },
              optional: true,
            },
            alt: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
              optional: true,
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'image',
              },
            },
          },
        },
        optional: true,
      },
      relatedArea: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            _ref: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'reference',
              },
            },
            _weak: {
              type: 'objectAttribute',
              value: {
                type: 'boolean',
              },
              optional: true,
            },
          },
          dereferencesTo: 'listing',
        },
        optional: true,
      },
      relatedCampaign: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            _ref: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'reference',
              },
            },
            _weak: {
              type: 'objectAttribute',
              value: {
                type: 'boolean',
              },
              optional: true,
            },
          },
          dereferencesTo: 'campaign',
        },
        optional: true,
      },
      featured: {
        type: 'objectAttribute',
        value: {
          type: 'boolean',
        },
        optional: true,
      },
    },
  },
  {
    name: 'notice',
    type: 'document',
    attributes: {
      _id: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _type: {
        type: 'objectAttribute',
        value: {
          type: 'string',
          value: 'notice',
        },
      },
      _createdAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _updatedAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _rev: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      title: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      slug: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'slug',
        },
        optional: true,
      },
      noticeType: {
        type: 'objectAttribute',
        value: {
          type: 'union',
          of: [
            {
              type: 'string',
              value: 'meeting',
            },
            {
              type: 'string',
              value: 'announcement',
            },
            {
              type: 'string',
              value: 'resolution',
            },
            {
              type: 'string',
              value: 'alert',
            },
            {
              type: 'string',
              value: 'opportunity',
            },
            {
              type: 'string',
              value: 'employment',
            },
            {
              type: 'string',
              value: 'smme',
            },
            {
              type: 'string',
              value: 'project-update',
            },
          ],
        },
        optional: true,
      },
      date: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      excerpt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      content: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'blockContent',
        },
        optional: true,
      },
      image: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            asset: {
              type: 'objectAttribute',
              value: {
                type: 'object',
                attributes: {
                  _ref: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                  _type: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                      value: 'reference',
                    },
                  },
                  _weak: {
                    type: 'objectAttribute',
                    value: {
                      type: 'boolean',
                    },
                    optional: true,
                  },
                },
                dereferencesTo: 'sanity.imageAsset',
              },
              optional: true,
            },
            hotspot: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageHotspot',
              },
              optional: true,
            },
            crop: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageCrop',
              },
              optional: true,
            },
            alt: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
              optional: true,
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'image',
              },
            },
          },
        },
        optional: true,
      },
      pinned: {
        type: 'objectAttribute',
        value: {
          type: 'boolean',
        },
        optional: true,
      },
      linkingNote: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      relatedArea: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            _ref: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'reference',
              },
            },
            _weak: {
              type: 'objectAttribute',
              value: {
                type: 'boolean',
              },
              optional: true,
            },
          },
          dereferencesTo: 'listing',
        },
        optional: true,
      },
      relatedCampaign: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            _ref: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'reference',
              },
            },
            _weak: {
              type: 'objectAttribute',
              value: {
                type: 'boolean',
              },
              optional: true,
            },
          },
          dereferencesTo: 'campaign',
        },
        optional: true,
      },
      originNotice: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            _ref: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'reference',
              },
            },
            _weak: {
              type: 'objectAttribute',
              value: {
                type: 'boolean',
              },
              optional: true,
            },
          },
          dereferencesTo: 'notice',
        },
        optional: true,
      },
    },
  },
  {
    name: 'developmentNotice',
    type: 'document',
    attributes: {
      _id: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _type: {
        type: 'objectAttribute',
        value: {
          type: 'string',
          value: 'developmentNotice',
        },
      },
      _createdAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _updatedAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _rev: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      title: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      slug: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'slug',
        },
        optional: true,
      },
      noticeType: {
        type: 'objectAttribute',
        value: {
          type: 'union',
          of: [
            {
              type: 'string',
              value: 'eia',
            },
            {
              type: 'string',
              value: 'rezoning',
            },
            {
              type: 'string',
              value: 'land-use',
            },
            {
              type: 'string',
              value: 'township',
            },
            {
              type: 'string',
              value: 'building',
            },
            {
              type: 'string',
              value: 'mining',
            },
            {
              type: 'string',
              value: 'liquor',
            },
            {
              type: 'string',
              value: 'telecom',
            },
            {
              type: 'string',
              value: 'estate',
            },
            {
              type: 'string',
              value: 'liquidation',
            },
            {
              type: 'string',
              value: 'pto',
            },
            {
              type: 'string',
              value: 'other',
            },
          ],
        },
        optional: true,
      },
      status: {
        type: 'objectAttribute',
        value: {
          type: 'union',
          of: [
            {
              type: 'string',
              value: 'open',
            },
            {
              type: 'string',
              value: 'closed',
            },
            {
              type: 'string',
              value: 'approved',
            },
            {
              type: 'string',
              value: 'rejected',
            },
            {
              type: 'string',
              value: 'withdrawn',
            },
          ],
        },
        optional: true,
      },
      legalMandate: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      retentionPeriod: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      fee: {
        type: 'objectAttribute',
        value: {
          type: 'number',
        },
        optional: true,
      },
      feeStatus: {
        type: 'objectAttribute',
        value: {
          type: 'union',
          of: [
            {
              type: 'string',
              value: 'free',
            },
            {
              type: 'string',
              value: 'invoiced',
            },
            {
              type: 'string',
              value: 'paid',
            },
          ],
        },
        optional: true,
      },
      guideNote: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      applicant: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      referenceNumber: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      description: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      content: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'blockContent',
        },
        optional: true,
      },
      location: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      geopoint: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'geopoint',
        },
        optional: true,
      },
      commentDeadline: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      commentContact: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      publishDate: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      commentsReceived: {
        type: 'objectAttribute',
        value: {
          type: 'number',
        },
        optional: true,
      },
      proofIssued: {
        type: 'objectAttribute',
        value: {
          type: 'boolean',
        },
        optional: true,
      },
      image: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            asset: {
              type: 'objectAttribute',
              value: {
                type: 'object',
                attributes: {
                  _ref: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                  _type: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                      value: 'reference',
                    },
                  },
                  _weak: {
                    type: 'objectAttribute',
                    value: {
                      type: 'boolean',
                    },
                    optional: true,
                  },
                },
                dereferencesTo: 'sanity.imageAsset',
              },
              optional: true,
            },
            hotspot: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageHotspot',
              },
              optional: true,
            },
            crop: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageCrop',
              },
              optional: true,
            },
            alt: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
              optional: true,
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'image',
              },
            },
          },
        },
        optional: true,
      },
      documents: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'object',
            attributes: {
              asset: {
                type: 'objectAttribute',
                value: {
                  type: 'object',
                  attributes: {
                    _ref: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                      },
                    },
                    _type: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                        value: 'reference',
                      },
                    },
                    _weak: {
                      type: 'objectAttribute',
                      value: {
                        type: 'boolean',
                      },
                      optional: true,
                    },
                  },
                  dereferencesTo: 'sanity.fileAsset',
                },
                optional: true,
              },
              title: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'file',
                },
              },
            },
            rest: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        optional: true,
      },
      relatedArea: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            _ref: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'reference',
              },
            },
            _weak: {
              type: 'objectAttribute',
              value: {
                type: 'boolean',
              },
              optional: true,
            },
          },
          dereferencesTo: 'listing',
        },
        optional: true,
      },
      relatedCampaign: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            _ref: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'reference',
              },
            },
            _weak: {
              type: 'objectAttribute',
              value: {
                type: 'boolean',
              },
              optional: true,
            },
          },
          dereferencesTo: 'campaign',
        },
        optional: true,
      },
    },
  },
  {
    name: 'campaign',
    type: 'document',
    attributes: {
      _id: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _type: {
        type: 'objectAttribute',
        value: {
          type: 'string',
          value: 'campaign',
        },
      },
      _createdAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _updatedAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _rev: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      title: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      slug: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'slug',
        },
        optional: true,
      },
      campaignType: {
        type: 'objectAttribute',
        value: {
          type: 'union',
          of: [
            {
              type: 'string',
              value: 'ad',
            },
            {
              type: 'string',
              value: 'activation',
            },
            {
              type: 'string',
              value: 'csr',
            },
          ],
        },
        optional: true,
      },
      status: {
        type: 'objectAttribute',
        value: {
          type: 'union',
          of: [
            {
              type: 'string',
              value: 'draft',
            },
            {
              type: 'string',
              value: 'approved',
            },
            {
              type: 'string',
              value: 'active',
            },
            {
              type: 'string',
              value: 'completed',
            },
            {
              type: 'string',
              value: 'reported',
            },
          ],
        },
        optional: true,
      },
      projectReference: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      projectHealth: {
        type: 'objectAttribute',
        value: {
          type: 'union',
          of: [
            {
              type: 'string',
              value: 'green',
            },
            {
              type: 'string',
              value: 'amber',
            },
            {
              type: 'string',
              value: 'red',
            },
          ],
        },
        optional: true,
      },
      sponsor: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            _ref: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'reference',
              },
            },
            _weak: {
              type: 'objectAttribute',
              value: {
                type: 'boolean',
              },
              optional: true,
            },
          },
          dereferencesTo: 'sponsor',
        },
        optional: true,
      },
      contactPerson: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            _ref: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'reference',
              },
            },
            _weak: {
              type: 'objectAttribute',
              value: {
                type: 'boolean',
              },
              optional: true,
            },
          },
          dereferencesTo: 'person',
        },
        optional: true,
      },
      description: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      contentNote: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      content: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'blockContent',
        },
        optional: true,
      },
      targetAudience: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      tags: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'string',
          },
        },
        optional: true,
      },
      startDate: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      endDate: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      fundingSource: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      contractor: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      contractNumber: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      consultingEngineer: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      localSMMEs: {
        type: 'objectAttribute',
        value: {
          type: 'number',
        },
        optional: true,
      },
      smmeDirectory: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'object',
            attributes: {
              name: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              service: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              owner: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              cipcNumber: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              taxClearance: {
                type: 'objectAttribute',
                value: {
                  type: 'union',
                  of: [
                    {
                      type: 'string',
                      value: 'valid',
                    },
                    {
                      type: 'string',
                      value: 'expired',
                    },
                    {
                      type: 'string',
                      value: 'none',
                    },
                  ],
                },
                optional: true,
              },
              bbbeeLevel: {
                type: 'objectAttribute',
                value: {
                  type: 'union',
                  of: [
                    {
                      type: 'string',
                      value: '1',
                    },
                    {
                      type: 'string',
                      value: '2',
                    },
                    {
                      type: 'string',
                      value: '3',
                    },
                    {
                      type: 'string',
                      value: '4',
                    },
                    {
                      type: 'string',
                      value: 'eme',
                    },
                    {
                      type: 'string',
                      value: 'qse',
                    },
                    {
                      type: 'string',
                      value: 'none',
                    },
                  ],
                },
                optional: true,
              },
              ward: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              contactPhone: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              verified: {
                type: 'objectAttribute',
                value: {
                  type: 'boolean',
                },
                optional: true,
              },
              complianceStatus: {
                type: 'objectAttribute',
                value: {
                  type: 'union',
                  of: [
                    {
                      type: 'string',
                      value: 'compliant',
                    },
                    {
                      type: 'string',
                      value: 'partial',
                    },
                    {
                      type: 'string',
                      value: 'non-compliant',
                    },
                    {
                      type: 'string',
                      value: 'pending',
                    },
                  ],
                },
                optional: true,
              },
              logo: {
                type: 'objectAttribute',
                value: {
                  type: 'object',
                  attributes: {
                    asset: {
                      type: 'objectAttribute',
                      value: {
                        type: 'object',
                        attributes: {
                          _ref: {
                            type: 'objectAttribute',
                            value: {
                              type: 'string',
                            },
                          },
                          _type: {
                            type: 'objectAttribute',
                            value: {
                              type: 'string',
                              value: 'reference',
                            },
                          },
                          _weak: {
                            type: 'objectAttribute',
                            value: {
                              type: 'boolean',
                            },
                            optional: true,
                          },
                        },
                        dereferencesTo: 'sanity.imageAsset',
                      },
                      optional: true,
                    },
                    hotspot: {
                      type: 'objectAttribute',
                      value: {
                        type: 'inline',
                        name: 'sanity.imageHotspot',
                      },
                      optional: true,
                    },
                    crop: {
                      type: 'objectAttribute',
                      value: {
                        type: 'inline',
                        name: 'sanity.imageCrop',
                      },
                      optional: true,
                    },
                    _type: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                        value: 'image',
                      },
                    },
                  },
                },
                optional: true,
              },
            },
            rest: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        optional: true,
      },
      projectPhase: {
        type: 'objectAttribute',
        value: {
          type: 'union',
          of: [
            {
              type: 'string',
              value: 'planning',
            },
            {
              type: 'string',
              value: 'procurement',
            },
            {
              type: 'string',
              value: 'construction',
            },
            {
              type: 'string',
              value: 'commissioning',
            },
            {
              type: 'string',
              value: 'operational',
            },
          ],
        },
        optional: true,
      },
      progressLog: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'object',
            attributes: {
              date: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              update: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
            },
            rest: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        optional: true,
      },
      projectUpdates: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'object',
            attributes: {
              date: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              title: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              content: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'blockContent',
                },
                optional: true,
              },
              gallery: {
                type: 'objectAttribute',
                value: {
                  type: 'array',
                  of: {
                    type: 'object',
                    attributes: {
                      asset: {
                        type: 'objectAttribute',
                        value: {
                          type: 'object',
                          attributes: {
                            _ref: {
                              type: 'objectAttribute',
                              value: {
                                type: 'string',
                              },
                            },
                            _type: {
                              type: 'objectAttribute',
                              value: {
                                type: 'string',
                                value: 'reference',
                              },
                            },
                            _weak: {
                              type: 'objectAttribute',
                              value: {
                                type: 'boolean',
                              },
                              optional: true,
                            },
                          },
                          dereferencesTo: 'sanity.imageAsset',
                        },
                        optional: true,
                      },
                      hotspot: {
                        type: 'objectAttribute',
                        value: {
                          type: 'inline',
                          name: 'sanity.imageHotspot',
                        },
                        optional: true,
                      },
                      crop: {
                        type: 'objectAttribute',
                        value: {
                          type: 'inline',
                          name: 'sanity.imageCrop',
                        },
                        optional: true,
                      },
                      alt: {
                        type: 'objectAttribute',
                        value: {
                          type: 'string',
                        },
                        optional: true,
                      },
                      caption: {
                        type: 'objectAttribute',
                        value: {
                          type: 'string',
                        },
                        optional: true,
                      },
                      _type: {
                        type: 'objectAttribute',
                        value: {
                          type: 'string',
                          value: 'image',
                        },
                      },
                    },
                    rest: {
                      type: 'object',
                      attributes: {
                        _key: {
                          type: 'objectAttribute',
                          value: {
                            type: 'string',
                          },
                        },
                      },
                    },
                  },
                },
                optional: true,
              },
              videoUrl: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
            },
            rest: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        optional: true,
      },
      communityNote: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'object',
            attributes: {
              date: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              issuedBy: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              message: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
            },
            rest: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        optional: true,
      },
      participationLog: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'object',
            attributes: {
              date: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              commentType: {
                type: 'objectAttribute',
                value: {
                  type: 'union',
                  of: [
                    {
                      type: 'string',
                      value: 'comment',
                    },
                    {
                      type: 'string',
                      value: 'objection',
                    },
                    {
                      type: 'string',
                      value: 'support',
                    },
                    {
                      type: 'string',
                      value: 'question',
                    },
                    {
                      type: 'string',
                      value: 'complaint',
                    },
                    {
                      type: 'string',
                      value: 'issue',
                    },
                  ],
                },
                optional: true,
              },
              relationship: {
                type: 'objectAttribute',
                value: {
                  type: 'union',
                  of: [
                    {
                      type: 'string',
                      value: 'resident',
                    },
                    {
                      type: 'string',
                      value: 'landowner',
                    },
                    {
                      type: 'string',
                      value: 'business',
                    },
                    {
                      type: 'string',
                      value: 'community',
                    },
                    {
                      type: 'string',
                      value: 'organisation',
                    },
                    {
                      type: 'string',
                      value: 'other',
                    },
                  ],
                },
                optional: true,
              },
              summary: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              actionTaken: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
            },
            rest: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        optional: true,
      },
      relatedListings: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'object',
            attributes: {
              _ref: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'reference',
                },
              },
              _weak: {
                type: 'objectAttribute',
                value: {
                  type: 'boolean',
                },
                optional: true,
              },
            },
            dereferencesTo: 'listing',
            rest: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        optional: true,
      },
      relatedAreas: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'object',
            attributes: {
              _ref: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'reference',
                },
              },
              _weak: {
                type: 'objectAttribute',
                value: {
                  type: 'boolean',
                },
                optional: true,
              },
            },
            dereferencesTo: 'listing',
            rest: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        optional: true,
      },
      relatedProgram: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            _ref: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'reference',
              },
            },
            _weak: {
              type: 'objectAttribute',
              value: {
                type: 'boolean',
              },
              optional: true,
            },
          },
          dereferencesTo: 'program',
        },
        optional: true,
      },
      link: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      image: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            asset: {
              type: 'objectAttribute',
              value: {
                type: 'object',
                attributes: {
                  _ref: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                  _type: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                      value: 'reference',
                    },
                  },
                  _weak: {
                    type: 'objectAttribute',
                    value: {
                      type: 'boolean',
                    },
                    optional: true,
                  },
                },
                dereferencesTo: 'sanity.imageAsset',
              },
              optional: true,
            },
            hotspot: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageHotspot',
              },
              optional: true,
            },
            crop: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageCrop',
              },
              optional: true,
            },
            alt: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
              optional: true,
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'image',
              },
            },
          },
        },
        optional: true,
      },
      hideCoverImage: {
        type: 'objectAttribute',
        value: {
          type: 'boolean',
        },
        optional: true,
      },
      stakeholderLogos: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'object',
            attributes: {
              asset: {
                type: 'objectAttribute',
                value: {
                  type: 'object',
                  attributes: {
                    _ref: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                      },
                    },
                    _type: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                        value: 'reference',
                      },
                    },
                    _weak: {
                      type: 'objectAttribute',
                      value: {
                        type: 'boolean',
                      },
                      optional: true,
                    },
                  },
                  dereferencesTo: 'sanity.imageAsset',
                },
                optional: true,
              },
              hotspot: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageHotspot',
                },
                optional: true,
              },
              crop: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageCrop',
                },
                optional: true,
              },
              name: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'image',
                },
              },
            },
            rest: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        optional: true,
      },
      bannerImage: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            asset: {
              type: 'objectAttribute',
              value: {
                type: 'object',
                attributes: {
                  _ref: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                  _type: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                      value: 'reference',
                    },
                  },
                  _weak: {
                    type: 'objectAttribute',
                    value: {
                      type: 'boolean',
                    },
                    optional: true,
                  },
                },
                dereferencesTo: 'sanity.imageAsset',
              },
              optional: true,
            },
            hotspot: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageHotspot',
              },
              optional: true,
            },
            crop: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageCrop',
              },
              optional: true,
            },
            alt: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
              optional: true,
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'image',
              },
            },
          },
        },
        optional: true,
      },
      gallery: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'object',
            attributes: {
              asset: {
                type: 'objectAttribute',
                value: {
                  type: 'object',
                  attributes: {
                    _ref: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                      },
                    },
                    _type: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                        value: 'reference',
                      },
                    },
                    _weak: {
                      type: 'objectAttribute',
                      value: {
                        type: 'boolean',
                      },
                      optional: true,
                    },
                  },
                  dereferencesTo: 'sanity.imageAsset',
                },
                optional: true,
              },
              hotspot: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageHotspot',
                },
                optional: true,
              },
              crop: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageCrop',
                },
                optional: true,
              },
              alt: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              caption: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'image',
                },
              },
            },
            rest: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        optional: true,
      },
      videoUrl: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      audioFile: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            asset: {
              type: 'objectAttribute',
              value: {
                type: 'object',
                attributes: {
                  _ref: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                  _type: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                      value: 'reference',
                    },
                  },
                  _weak: {
                    type: 'objectAttribute',
                    value: {
                      type: 'boolean',
                    },
                    optional: true,
                  },
                },
                dereferencesTo: 'sanity.fileAsset',
              },
              optional: true,
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'file',
              },
            },
          },
        },
        optional: true,
      },
      documents: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'object',
            attributes: {
              asset: {
                type: 'objectAttribute',
                value: {
                  type: 'object',
                  attributes: {
                    _ref: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                      },
                    },
                    _type: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                        value: 'reference',
                      },
                    },
                    _weak: {
                      type: 'objectAttribute',
                      value: {
                        type: 'boolean',
                      },
                      optional: true,
                    },
                  },
                  dereferencesTo: 'sanity.fileAsset',
                },
                optional: true,
              },
              title: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'file',
                },
              },
            },
            rest: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        optional: true,
      },
      trackingNote: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      budget: {
        type: 'objectAttribute',
        value: {
          type: 'number',
        },
        optional: true,
      },
      beneficiaries: {
        type: 'objectAttribute',
        value: {
          type: 'number',
        },
        optional: true,
      },
      impactSummary: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      lessonsLearned: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      deliverables: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'string',
          },
        },
        optional: true,
      },
      deliverablesCertified: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'object',
            attributes: {
              task: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              status: {
                type: 'objectAttribute',
                value: {
                  type: 'union',
                  of: [
                    {
                      type: 'string',
                      value: 'pending',
                    },
                    {
                      type: 'string',
                      value: 'certified',
                    },
                    {
                      type: 'string',
                      value: 'disputed',
                    },
                  ],
                },
                optional: true,
              },
              certifiedBy: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              percentageComplete: {
                type: 'objectAttribute',
                value: {
                  type: 'number',
                },
                optional: true,
              },
              weightage: {
                type: 'objectAttribute',
                value: {
                  type: 'number',
                },
                optional: true,
              },
              certificationDate: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              notes: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
            },
            rest: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        optional: true,
      },
      totalDeliverables: {
        type: 'objectAttribute',
        value: {
          type: 'number',
        },
        optional: true,
      },
      seo: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'seoMetaFields',
        },
        optional: true,
      },
    },
  },
  {
    name: 'program',
    type: 'document',
    attributes: {
      _id: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _type: {
        type: 'objectAttribute',
        value: {
          type: 'string',
          value: 'program',
        },
      },
      _createdAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _updatedAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _rev: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      title: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      slug: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'slug',
        },
        optional: true,
      },
      programType: {
        type: 'objectAttribute',
        value: {
          type: 'union',
          of: [
            {
              type: 'string',
              value: 'youth-event',
            },
            {
              type: 'string',
              value: 'skills',
            },
            {
              type: 'string',
              value: 'school',
            },
            {
              type: 'string',
              value: 'community',
            },
          ],
        },
        optional: true,
      },
      date: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      description: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      content: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'blockContent',
        },
        optional: true,
      },
      image: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            asset: {
              type: 'objectAttribute',
              value: {
                type: 'object',
                attributes: {
                  _ref: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                  _type: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                      value: 'reference',
                    },
                  },
                  _weak: {
                    type: 'objectAttribute',
                    value: {
                      type: 'boolean',
                    },
                    optional: true,
                  },
                },
                dereferencesTo: 'sanity.imageAsset',
              },
              optional: true,
            },
            hotspot: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageHotspot',
              },
              optional: true,
            },
            crop: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageCrop',
              },
              optional: true,
            },
            alt: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
              optional: true,
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'image',
              },
            },
          },
        },
        optional: true,
      },
      statusNote: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      status: {
        type: 'objectAttribute',
        value: {
          type: 'union',
          of: [
            {
              type: 'string',
              value: 'upcoming',
            },
            {
              type: 'string',
              value: 'active',
            },
            {
              type: 'string',
              value: 'completed',
            },
          ],
        },
        optional: true,
      },
      relatedArea: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            _ref: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'reference',
              },
            },
            _weak: {
              type: 'objectAttribute',
              value: {
                type: 'boolean',
              },
              optional: true,
            },
          },
          dereferencesTo: 'listing',
        },
        optional: true,
      },
    },
  },
  {
    name: 'sponsor',
    type: 'document',
    attributes: {
      _id: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _type: {
        type: 'objectAttribute',
        value: {
          type: 'string',
          value: 'sponsor',
        },
      },
      _createdAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _updatedAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _rev: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      name: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      slug: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'slug',
        },
        optional: true,
      },
      sponsorType: {
        type: 'objectAttribute',
        value: {
          type: 'union',
          of: [
            {
              type: 'string',
              value: 'ngo',
            },
            {
              type: 'string',
              value: 'business',
            },
            {
              type: 'string',
              value: 'government',
            },
            {
              type: 'string',
              value: 'community',
            },
            {
              type: 'string',
              value: 'individual',
            },
          ],
        },
        optional: true,
      },
      logo: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            asset: {
              type: 'objectAttribute',
              value: {
                type: 'object',
                attributes: {
                  _ref: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                  _type: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                      value: 'reference',
                    },
                  },
                  _weak: {
                    type: 'objectAttribute',
                    value: {
                      type: 'boolean',
                    },
                    optional: true,
                  },
                },
                dereferencesTo: 'sanity.imageAsset',
              },
              optional: true,
            },
            hotspot: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageHotspot',
              },
              optional: true,
            },
            crop: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageCrop',
              },
              optional: true,
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'image',
              },
            },
          },
        },
        optional: true,
      },
      website: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      description: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      contactEmail: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      contactPhone: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
    },
  },
  {
    name: 'listing',
    type: 'document',
    attributes: {
      _id: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _type: {
        type: 'objectAttribute',
        value: {
          type: 'string',
          value: 'listing',
        },
      },
      _createdAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _updatedAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _rev: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      name: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      slug: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'slug',
        },
        optional: true,
      },
      listingType: {
        type: 'objectAttribute',
        value: {
          type: 'union',
          of: [
            {
              type: 'string',
              value: 'school',
            },
            {
              type: 'string',
              value: 'clinic',
            },
            {
              type: 'string',
              value: 'business',
            },
            {
              type: 'string',
              value: 'accommodation',
            },
            {
              type: 'string',
              value: 'church',
            },
            {
              type: 'string',
              value: 'facility',
            },
            {
              type: 'string',
              value: 'area',
            },
          ],
        },
        optional: true,
      },
      description: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      content: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'blockContent',
        },
        optional: true,
      },
      location: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      geopoint: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'geopoint',
        },
        optional: true,
      },
      contactInfo: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      whatsappContact: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      website: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      servicesOffered: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'string',
          },
        },
        optional: true,
      },
      operatingHours: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      verificationNote: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      verifiedByInduna: {
        type: 'objectAttribute',
        value: {
          type: 'union',
          of: [
            {
              type: 'string',
              value: 'community',
            },
            {
              type: 'string',
              value: 'induna',
            },
            {
              type: 'string',
              value: 'council',
            },
          ],
        },
        optional: true,
      },
      image: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            asset: {
              type: 'objectAttribute',
              value: {
                type: 'object',
                attributes: {
                  _ref: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                  _type: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                      value: 'reference',
                    },
                  },
                  _weak: {
                    type: 'objectAttribute',
                    value: {
                      type: 'boolean',
                    },
                    optional: true,
                  },
                },
                dereferencesTo: 'sanity.imageAsset',
              },
              optional: true,
            },
            hotspot: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageHotspot',
              },
              optional: true,
            },
            crop: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageCrop',
              },
              optional: true,
            },
            alt: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
              optional: true,
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'image',
              },
            },
          },
        },
        optional: true,
      },
      featured: {
        type: 'objectAttribute',
        value: {
          type: 'boolean',
        },
        optional: true,
      },
      images: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'object',
            attributes: {
              asset: {
                type: 'objectAttribute',
                value: {
                  type: 'object',
                  attributes: {
                    _ref: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                      },
                    },
                    _type: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                        value: 'reference',
                      },
                    },
                    _weak: {
                      type: 'objectAttribute',
                      value: {
                        type: 'boolean',
                      },
                      optional: true,
                    },
                  },
                  dereferencesTo: 'sanity.imageAsset',
                },
                optional: true,
              },
              hotspot: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageHotspot',
                },
                optional: true,
              },
              crop: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageCrop',
                },
                optional: true,
              },
              alt: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              caption: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'image',
                },
              },
            },
            rest: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        optional: true,
      },
      relatedArea: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            _ref: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'reference',
              },
            },
            _weak: {
              type: 'objectAttribute',
              value: {
                type: 'boolean',
              },
              optional: true,
            },
          },
          dereferencesTo: 'listing',
        },
        optional: true,
      },
      induna: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            _ref: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'reference',
              },
            },
            _weak: {
              type: 'objectAttribute',
              value: {
                type: 'boolean',
              },
              optional: true,
            },
          },
          dereferencesTo: 'person',
        },
        optional: true,
      },
      relatedListings: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'object',
            attributes: {
              _ref: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'reference',
                },
              },
              _weak: {
                type: 'objectAttribute',
                value: {
                  type: 'boolean',
                },
                optional: true,
              },
            },
            dereferencesTo: 'listing',
            rest: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        optional: true,
      },
    },
  },
  {
    name: 'sanity.fileAsset',
    type: 'document',
    attributes: {
      _id: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _type: {
        type: 'objectAttribute',
        value: {
          type: 'string',
          value: 'sanity.fileAsset',
        },
      },
      _createdAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _updatedAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _rev: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      originalFilename: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      label: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      title: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      description: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      altText: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      sha1hash: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      extension: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      mimeType: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      size: {
        type: 'objectAttribute',
        value: {
          type: 'number',
        },
        optional: true,
      },
      assetId: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      uploadId: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      path: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      url: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      source: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'sanity.assetSourceData',
        },
        optional: true,
      },
    },
  },
  {
    name: 'geopoint',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'geopoint',
          },
        },
        lat: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
        lng: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
        alt: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'category',
    type: 'document',
    attributes: {
      _id: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _type: {
        type: 'objectAttribute',
        value: {
          type: 'string',
          value: 'category',
        },
      },
      _createdAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _updatedAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _rev: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      title: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      slug: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'slug',
        },
        optional: true,
      },
      description: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
    },
  },
  {
    name: 'post',
    type: 'document',
    attributes: {
      _id: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _type: {
        type: 'objectAttribute',
        value: {
          type: 'string',
          value: 'post',
        },
      },
      _createdAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _updatedAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _rev: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      title: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      slug: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'slug',
        },
        optional: true,
      },
      image: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            asset: {
              type: 'objectAttribute',
              value: {
                type: 'object',
                attributes: {
                  _ref: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                  _type: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                      value: 'reference',
                    },
                  },
                  _weak: {
                    type: 'objectAttribute',
                    value: {
                      type: 'boolean',
                    },
                    optional: true,
                  },
                },
                dereferencesTo: 'sanity.imageAsset',
              },
              optional: true,
            },
            hotspot: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageHotspot',
              },
              optional: true,
            },
            crop: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageCrop',
              },
              optional: true,
            },
            alt: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
              optional: true,
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'image',
              },
            },
          },
        },
        optional: true,
      },
      content: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'blockContent',
        },
        optional: true,
      },
      excerpt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      categories: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'object',
            attributes: {
              _ref: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'reference',
                },
              },
              _weak: {
                type: 'objectAttribute',
                value: {
                  type: 'boolean',
                },
                optional: true,
              },
            },
            dereferencesTo: 'category',
            rest: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        optional: true,
      },
      date: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      author: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            _ref: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'reference',
              },
            },
            _weak: {
              type: 'objectAttribute',
              value: {
                type: 'boolean',
              },
              optional: true,
            },
          },
          dereferencesTo: 'person',
        },
        optional: true,
      },
      seo: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'seoMetaFields',
        },
        optional: true,
      },
    },
  },
  {
    name: 'person',
    type: 'document',
    attributes: {
      _id: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _type: {
        type: 'objectAttribute',
        value: {
          type: 'string',
          value: 'person',
        },
      },
      _createdAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _updatedAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _rev: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      firstName: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      lastName: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      slug: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'slug',
        },
        optional: true,
      },
      image: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            asset: {
              type: 'objectAttribute',
              value: {
                type: 'object',
                attributes: {
                  _ref: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                  _type: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                      value: 'reference',
                    },
                  },
                  _weak: {
                    type: 'objectAttribute',
                    value: {
                      type: 'boolean',
                    },
                    optional: true,
                  },
                },
                dereferencesTo: 'sanity.imageAsset',
              },
              optional: true,
            },
            hotspot: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageHotspot',
              },
              optional: true,
            },
            crop: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageCrop',
              },
              optional: true,
            },
            alt: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
              optional: true,
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'image',
              },
            },
          },
        },
        optional: true,
      },
      personType: {
        type: 'objectAttribute',
        value: {
          type: 'union',
          of: [
            {
              type: 'string',
              value: 'inkosi',
            },
            {
              type: 'string',
              value: 'induna',
            },
            {
              type: 'string',
              value: 'council',
            },
            {
              type: 'string',
              value: 'youth',
            },
            {
              type: 'string',
              value: 'community',
            },
            {
              type: 'string',
              value: 'author',
            },
          ],
        },
        optional: true,
      },
      leadershipNote: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      communityNote: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      role: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      email: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      phone: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      organization: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      skills: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'string',
          },
        },
        optional: true,
      },
      biography: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'blockContent',
        },
        optional: true,
      },
      gallery: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'object',
            attributes: {
              asset: {
                type: 'objectAttribute',
                value: {
                  type: 'object',
                  attributes: {
                    _ref: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                      },
                    },
                    _type: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                        value: 'reference',
                      },
                    },
                    _weak: {
                      type: 'objectAttribute',
                      value: {
                        type: 'boolean',
                      },
                      optional: true,
                    },
                  },
                  dereferencesTo: 'sanity.imageAsset',
                },
                optional: true,
              },
              hotspot: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageHotspot',
                },
                optional: true,
              },
              crop: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageCrop',
                },
                optional: true,
              },
              alt: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              caption: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'image',
                },
              },
            },
            rest: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        optional: true,
      },
    },
  },
  {
    name: 'page',
    type: 'document',
    attributes: {
      _id: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _type: {
        type: 'objectAttribute',
        value: {
          type: 'string',
          value: 'page',
        },
      },
      _createdAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _updatedAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _rev: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      name: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      slug: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'slug',
        },
        optional: true,
      },
      pageSections: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'union',
            of: [
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'adBanner',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'campaignList',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'cardGrid',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'communityMap',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'contactForm',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'cta',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'divider',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'embed',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'faq',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'gallery',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'hero',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'listingGrid',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'logoGrid',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'mediaText',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'noticeList',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'opportunityList',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'organogram',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'postList',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'process',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'programList',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'peopleGrid',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'quote',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'recordList',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'richText',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'sponsorGrid',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'stats',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'subscribe',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'teamGrid',
                },
              },
            ],
          },
        },
        optional: true,
      },
      seo: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'seoMetaFields',
        },
        optional: true,
      },
    },
  },
  {
    name: 'slug',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'slug',
          },
        },
        current: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        source: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'blogPage',
    type: 'document',
    attributes: {
      _id: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _type: {
        type: 'objectAttribute',
        value: {
          type: 'string',
          value: 'blogPage',
        },
      },
      _createdAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _updatedAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _rev: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      name: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      pageSections: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'union',
            of: [
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'adBanner',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'campaignList',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'cardGrid',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'communityMap',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'contactForm',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'cta',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'divider',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'embed',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'faq',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'gallery',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'hero',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'listingGrid',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'logoGrid',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'mediaText',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'noticeList',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'opportunityList',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'organogram',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'postList',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'process',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'programList',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'peopleGrid',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'quote',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'recordList',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'richText',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'sponsorGrid',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'stats',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'subscribe',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'teamGrid',
                },
              },
            ],
          },
        },
        optional: true,
      },
      seo: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'seoMetaFields',
        },
        optional: true,
      },
    },
  },
  {
    name: 'homePage',
    type: 'document',
    attributes: {
      _id: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _type: {
        type: 'objectAttribute',
        value: {
          type: 'string',
          value: 'homePage',
        },
      },
      _createdAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _updatedAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _rev: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      name: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      pageSections: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'union',
            of: [
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'adBanner',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'campaignList',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'cardGrid',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'communityMap',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'contactForm',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'cta',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'divider',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'embed',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'faq',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'gallery',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'hero',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'listingGrid',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'logoGrid',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'mediaText',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'noticeList',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'opportunityList',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'organogram',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'postList',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'process',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'programList',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'peopleGrid',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'quote',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'recordList',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'richText',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'sponsorGrid',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'stats',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'subscribe',
                },
              },
              {
                type: 'object',
                attributes: {
                  _key: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                },
                rest: {
                  type: 'inline',
                  name: 'teamGrid',
                },
              },
            ],
          },
        },
        optional: true,
      },
      seo: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'seoMetaFields',
        },
        optional: true,
      },
    },
  },
  {
    name: 'seoMetaFields',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'seoMetaFields',
          },
        },
        noIndex: {
          type: 'objectAttribute',
          value: {
            type: 'boolean',
          },
          optional: true,
        },
        metaTitle: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        metaDescription: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        metaImage: {
          type: 'objectAttribute',
          value: {
            type: 'object',
            attributes: {
              asset: {
                type: 'objectAttribute',
                value: {
                  type: 'object',
                  attributes: {
                    _ref: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                      },
                    },
                    _type: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                        value: 'reference',
                      },
                    },
                    _weak: {
                      type: 'objectAttribute',
                      value: {
                        type: 'boolean',
                      },
                      optional: true,
                    },
                  },
                  dereferencesTo: 'sanity.imageAsset',
                },
                optional: true,
              },
              hotspot: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageHotspot',
                },
                optional: true,
              },
              crop: {
                type: 'objectAttribute',
                value: {
                  type: 'inline',
                  name: 'sanity.imageCrop',
                },
                optional: true,
              },
              alt: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
                optional: true,
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'image',
                },
              },
            },
          },
          optional: true,
        },
        seoKeywords: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'string',
            },
          },
          optional: true,
        },
        openGraph: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'openGraph',
          },
          optional: true,
        },
        additionalMetaTags: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
              rest: {
                type: 'inline',
                name: 'metaTag',
              },
            },
          },
          optional: true,
        },
        twitter: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'twitter',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'link',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'link',
          },
        },
        type: {
          type: 'objectAttribute',
          value: {
            type: 'union',
            of: [
              {
                type: 'string',
                value: 'internal',
              },
              {
                type: 'string',
                value: 'external',
              },
            ],
          },
          optional: true,
        },
        openInNewTab: {
          type: 'objectAttribute',
          value: {
            type: 'boolean',
          },
          optional: true,
        },
        external: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        href: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        internal: {
          type: 'objectAttribute',
          value: {
            type: 'union',
            of: [
              {
                type: 'object',
                attributes: {
                  _ref: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                  _type: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                      value: 'reference',
                    },
                  },
                  _weak: {
                    type: 'objectAttribute',
                    value: {
                      type: 'boolean',
                    },
                    optional: true,
                  },
                },
                dereferencesTo: 'post',
              },
              {
                type: 'object',
                attributes: {
                  _ref: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                  _type: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                      value: 'reference',
                    },
                  },
                  _weak: {
                    type: 'objectAttribute',
                    value: {
                      type: 'boolean',
                    },
                    optional: true,
                  },
                },
                dereferencesTo: 'page',
              },
              {
                type: 'object',
                attributes: {
                  _ref: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                  _type: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                      value: 'reference',
                    },
                  },
                  _weak: {
                    type: 'objectAttribute',
                    value: {
                      type: 'boolean',
                    },
                    optional: true,
                  },
                },
                dereferencesTo: 'category',
              },
              {
                type: 'object',
                attributes: {
                  _ref: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                  _type: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                      value: 'reference',
                    },
                  },
                  _weak: {
                    type: 'objectAttribute',
                    value: {
                      type: 'boolean',
                    },
                    optional: true,
                  },
                },
                dereferencesTo: 'person',
              },
            ],
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'settings',
    type: 'document',
    attributes: {
      _id: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _type: {
        type: 'objectAttribute',
        value: {
          type: 'string',
          value: 'settings',
        },
      },
      _createdAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _updatedAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _rev: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      title: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      description: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      menu: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'object',
            attributes: {
              _key: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
              },
            },
            rest: {
              type: 'inline',
              name: 'menuItem',
            },
          },
        },
        optional: true,
      },
      ogImage: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            asset: {
              type: 'objectAttribute',
              value: {
                type: 'object',
                attributes: {
                  _ref: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                    },
                  },
                  _type: {
                    type: 'objectAttribute',
                    value: {
                      type: 'string',
                      value: 'reference',
                    },
                  },
                  _weak: {
                    type: 'objectAttribute',
                    value: {
                      type: 'boolean',
                    },
                    optional: true,
                  },
                },
                dereferencesTo: 'sanity.imageAsset',
              },
              optional: true,
            },
            hotspot: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageHotspot',
              },
              optional: true,
            },
            crop: {
              type: 'objectAttribute',
              value: {
                type: 'inline',
                name: 'sanity.imageCrop',
              },
              optional: true,
            },
            alt: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
              optional: true,
            },
            _type: {
              type: 'objectAttribute',
              value: {
                type: 'string',
                value: 'image',
              },
            },
          },
        },
        optional: true,
      },
      primaryColor: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      secondaryColor: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      contactEmail: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      contactPhone: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      address: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      socialLinks: {
        type: 'objectAttribute',
        value: {
          type: 'object',
          attributes: {
            facebook: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
              optional: true,
            },
            twitter: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
              optional: true,
            },
            instagram: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
              optional: true,
            },
            youtube: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
              optional: true,
            },
            whatsapp: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
              optional: true,
            },
          },
        },
        optional: true,
      },
      gtmId: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      webhookUrl: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      webhookPublicComment: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      webhookInfraFeedback: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      operatorEmail: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      exportToken: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
    },
  },
  {
    name: 'sanity.imageCrop',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'sanity.imageCrop',
          },
        },
        top: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
        bottom: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
        left: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
        right: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'sanity.imageHotspot',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'sanity.imageHotspot',
          },
        },
        x: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
        y: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
        height: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
        width: {
          type: 'objectAttribute',
          value: {
            type: 'number',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'sanity.imageAsset',
    type: 'document',
    attributes: {
      _id: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _type: {
        type: 'objectAttribute',
        value: {
          type: 'string',
          value: 'sanity.imageAsset',
        },
      },
      _createdAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _updatedAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _rev: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      originalFilename: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      label: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      title: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      description: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      altText: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      sha1hash: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      extension: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      mimeType: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      size: {
        type: 'objectAttribute',
        value: {
          type: 'number',
        },
        optional: true,
      },
      assetId: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      uploadId: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      path: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      url: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      metadata: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'sanity.imageMetadata',
        },
        optional: true,
      },
      source: {
        type: 'objectAttribute',
        value: {
          type: 'inline',
          name: 'sanity.assetSourceData',
        },
        optional: true,
      },
    },
  },
  {
    name: 'sanity.assetSourceData',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'sanity.assetSourceData',
          },
        },
        name: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        id: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        url: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'sanity.imageMetadata',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'sanity.imageMetadata',
          },
        },
        location: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'geopoint',
          },
          optional: true,
        },
        dimensions: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'sanity.imageDimensions',
          },
          optional: true,
        },
        palette: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'sanity.imagePalette',
          },
          optional: true,
        },
        lqip: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        blurHash: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        hasAlpha: {
          type: 'objectAttribute',
          value: {
            type: 'boolean',
          },
          optional: true,
        },
        isOpaque: {
          type: 'objectAttribute',
          value: {
            type: 'boolean',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'sanity.assist.instructionTask',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'sanity.assist.instructionTask',
          },
        },
        path: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        instructionKey: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        started: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        updated: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        info: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'sanity.assist.task.status',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'sanity.assist.task.status',
          },
        },
        tasks: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
              rest: {
                type: 'inline',
                name: 'sanity.assist.instructionTask',
              },
            },
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'sanity.assist.schemaType.annotations',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'sanity.assist.schemaType.annotations',
          },
        },
        title: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        fields: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
              rest: {
                type: 'inline',
                name: 'sanity.assist.schemaType.field',
              },
            },
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'sanity.assist.output.type',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'sanity.assist.output.type',
          },
        },
        type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'sanity.assist.output.field',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'sanity.assist.output.field',
          },
        },
        path: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'sanity.assist.instruction.context',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'sanity.assist.instruction.context',
          },
        },
        reference: {
          type: 'objectAttribute',
          value: {
            type: 'object',
            attributes: {
              _ref: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                },
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'reference',
                },
              },
              _weak: {
                type: 'objectAttribute',
                value: {
                  type: 'boolean',
                },
                optional: true,
              },
            },
            dereferencesTo: 'assist.instruction.context',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'assist.instruction.context',
    type: 'document',
    attributes: {
      _id: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _type: {
        type: 'objectAttribute',
        value: {
          type: 'string',
          value: 'assist.instruction.context',
        },
      },
      _createdAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _updatedAt: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      _rev: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
      },
      title: {
        type: 'objectAttribute',
        value: {
          type: 'string',
        },
        optional: true,
      },
      context: {
        type: 'objectAttribute',
        value: {
          type: 'array',
          of: {
            type: 'object',
            attributes: {
              children: {
                type: 'objectAttribute',
                value: {
                  type: 'array',
                  of: {
                    type: 'object',
                    attributes: {
                      marks: {
                        type: 'objectAttribute',
                        value: {
                          type: 'array',
                          of: {
                            type: 'string',
                          },
                        },
                        optional: true,
                      },
                      text: {
                        type: 'objectAttribute',
                        value: {
                          type: 'string',
                        },
                        optional: true,
                      },
                      _type: {
                        type: 'objectAttribute',
                        value: {
                          type: 'string',
                          value: 'span',
                        },
                      },
                    },
                    rest: {
                      type: 'object',
                      attributes: {
                        _key: {
                          type: 'objectAttribute',
                          value: {
                            type: 'string',
                          },
                        },
                      },
                    },
                  },
                },
                optional: true,
              },
              style: {
                type: 'objectAttribute',
                value: {
                  type: 'union',
                  of: [
                    {
                      type: 'string',
                      value: 'normal',
                    },
                  ],
                },
                optional: true,
              },
              listItem: {
                type: 'objectAttribute',
                value: {
                  type: 'union',
                  of: [],
                },
                optional: true,
              },
              markDefs: {
                type: 'objectAttribute',
                value: {
                  type: 'null',
                },
                optional: true,
              },
              level: {
                type: 'objectAttribute',
                value: {
                  type: 'number',
                },
                optional: true,
              },
              _type: {
                type: 'objectAttribute',
                value: {
                  type: 'string',
                  value: 'block',
                },
              },
            },
            rest: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        optional: true,
      },
    },
  },
  {
    name: 'sanity.assist.instruction.userInput',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'sanity.assist.instruction.userInput',
          },
        },
        message: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        description: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'sanity.assist.instruction.prompt',
    type: 'type',
    value: {
      type: 'array',
      of: {
        type: 'object',
        attributes: {
          children: {
            type: 'objectAttribute',
            value: {
              type: 'array',
              of: {
                type: 'union',
                of: [
                  {
                    type: 'object',
                    attributes: {
                      marks: {
                        type: 'objectAttribute',
                        value: {
                          type: 'array',
                          of: {
                            type: 'string',
                          },
                        },
                        optional: true,
                      },
                      text: {
                        type: 'objectAttribute',
                        value: {
                          type: 'string',
                        },
                        optional: true,
                      },
                      _type: {
                        type: 'objectAttribute',
                        value: {
                          type: 'string',
                          value: 'span',
                        },
                      },
                    },
                    rest: {
                      type: 'object',
                      attributes: {
                        _key: {
                          type: 'objectAttribute',
                          value: {
                            type: 'string',
                          },
                        },
                      },
                    },
                  },
                  {
                    type: 'object',
                    attributes: {
                      _key: {
                        type: 'objectAttribute',
                        value: {
                          type: 'string',
                        },
                      },
                    },
                    rest: {
                      type: 'inline',
                      name: 'sanity.assist.instruction.fieldRef',
                    },
                  },
                  {
                    type: 'object',
                    attributes: {
                      _key: {
                        type: 'objectAttribute',
                        value: {
                          type: 'string',
                        },
                      },
                    },
                    rest: {
                      type: 'inline',
                      name: 'sanity.assist.instruction.context',
                    },
                  },
                  {
                    type: 'object',
                    attributes: {
                      _key: {
                        type: 'objectAttribute',
                        value: {
                          type: 'string',
                        },
                      },
                    },
                    rest: {
                      type: 'inline',
                      name: 'sanity.assist.instruction.userInput',
                    },
                  },
                ],
              },
            },
            optional: true,
          },
          style: {
            type: 'objectAttribute',
            value: {
              type: 'union',
              of: [
                {
                  type: 'string',
                  value: 'normal',
                },
              ],
            },
            optional: true,
          },
          listItem: {
            type: 'objectAttribute',
            value: {
              type: 'union',
              of: [],
            },
            optional: true,
          },
          markDefs: {
            type: 'objectAttribute',
            value: {
              type: 'null',
            },
            optional: true,
          },
          level: {
            type: 'objectAttribute',
            value: {
              type: 'number',
            },
            optional: true,
          },
          _type: {
            type: 'objectAttribute',
            value: {
              type: 'string',
              value: 'block',
            },
          },
        },
        rest: {
          type: 'object',
          attributes: {
            _key: {
              type: 'objectAttribute',
              value: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
  {
    name: 'sanity.assist.instruction.fieldRef',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'sanity.assist.instruction.fieldRef',
          },
        },
        path: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'sanity.assist.instruction',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'sanity.assist.instruction',
          },
        },
        prompt: {
          type: 'objectAttribute',
          value: {
            type: 'inline',
            name: 'sanity.assist.instruction.prompt',
          },
          optional: true,
        },
        icon: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        title: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        userId: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        createdById: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        output: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'union',
              of: [
                {
                  type: 'object',
                  attributes: {
                    _key: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                      },
                    },
                  },
                  rest: {
                    type: 'inline',
                    name: 'sanity.assist.output.field',
                  },
                },
                {
                  type: 'object',
                  attributes: {
                    _key: {
                      type: 'objectAttribute',
                      value: {
                        type: 'string',
                      },
                    },
                  },
                  rest: {
                    type: 'inline',
                    name: 'sanity.assist.output.type',
                  },
                },
              ],
            },
          },
          optional: true,
        },
      },
    },
  },
  {
    name: 'sanity.assist.schemaType.field',
    type: 'type',
    value: {
      type: 'object',
      attributes: {
        _type: {
          type: 'objectAttribute',
          value: {
            type: 'string',
            value: 'sanity.assist.schemaType.field',
          },
        },
        path: {
          type: 'objectAttribute',
          value: {
            type: 'string',
          },
          optional: true,
        },
        instructions: {
          type: 'objectAttribute',
          value: {
            type: 'array',
            of: {
              type: 'object',
              attributes: {
                _key: {
                  type: 'objectAttribute',
                  value: {
                    type: 'string',
                  },
                },
              },
              rest: {
                type: 'inline',
                name: 'sanity.assist.instruction',
              },
            },
          },
          optional: true,
        },
      },
    },
  },
];
