/* global define */

define(function () {

    'use strict';

    return {
        "uid": {
            "id": "fx-uid-id",
            "type": "uid",
            "container": "name-container",
            "cssclass": "name-class",
            "label": {
                "EN": "Uid",
                "DE": "Suche",
                "ES": "Búsqueda",
                "FR": "Recherchet"
            },
            "component": {
                "rendering": {
                    "placeholder": {
                        "EN": "Uid",
                        "DE": "uid",
                        "ES": "uid",
                        "FR": "uid"
                    },
                    "htmlattributes": {
                        "className": "form-control"
                    }
                }
            }
        },
        "version": {
            "id": "fx-version-id",
            "type": "version",
            "container": "name-container",
            "cssclass": "name-class",
            "label": {
                "EN": "Version",
                "DE": "Suche",
                "ES": "Búsqueda",
                "FR": "Recherchet"
            },
            "component": {
                "rendering": {
                    "placeholder": {
                        "EN": "Version",
                        "DE": "Version",
                        "ES": "Version",
                        "FR": "Version"
                    },
                    "htmlattributes": {
                        "className": "form-control"
                    }
                }
            }
        },
        "resourceType": {
            "id": "fx-resourcestype-id",
            "type": "resourceType",
            "container": "resourcestype-container",
            "cssclass": "resourcestype",
            "label": {
                "EN": "Resources Type",
                "DE": "Suche",
                "ES": "Búsqueda",
                "FR": "Recherchet"
            },
            "details": {
                "cl": {
                    "uid": "RepresentationType"
                }
            },
            "component": {
                "source": {
                    "url": "http://fenix.fao.org/d3s_fenix/msd/choices/RepresentationType"
                },
                "rendering": {
                    "displayMember": "label",
                    "valueMember": "value",
                    "multiple": true,
                    "width": "100%",
                    "height": "100%"
                }
            }
        },
        "referencePeriod": {
            "id": "fx-referencePeriod-id",
            "type": "referencePeriod",
            "cssclass": "fx-catalog-mod-timerseries",
            "container": "referencePeriod-container",
            "label": {
                "EN": "Reference Range",
                "ES": "Intervalo de tiempo",
                "DE": "Zeitbereich",
                "FR": "Intervalle de temps"
            },
            "details": {
                "cl": {
                    "uid": "FAO_Period",
                    "version": "1.0"
                }
            },
            "component": {
                "source": {
                    "datafields": [
                        {
                            "name": "label",
                            "map": "title>EN"
                        },
                        {
                            "name": "value",
                            "map": "code"
                        }
                    ],
                    "id": "value",
                    "uid": "FAO_Period",
                    "version": "1.0",
                    "url": "http://fenix.fao.org/d3s_fenix/msd/codes/filter"
                },
                "rendering": {
                    "displayMember": "label",
                    "valueMember": "value",
                    "multiple": true,
                    "width": "100%",
                    "height": "100%"
                }
            }
        },
        "referenceArea": {
            "id": "fx-referenceArea-id",
            "type": "referenceArea",
            "cssclass": "fx-catalog-mod-timerseries",
            "container": "referenceArea-container",
            "label": {
                "EN": "Reference Area",
                "ES": "Intervalo de tiempo",
                "DE": "Zeitbereich",
                "FR": "Intervalle de temps"
            },
            "details": {
                "cl": {
                    "uid": "GAUL_ReferenceArea",
                    "version": "1.0"
                }
            },
            "component": {
                "source": {
                    "datafields": [
                        {
                            "name": "label",
                            "map": "title>EN"
                        },
                        {
                            "name": "value",
                            "map": "code"
                        }
                    ],
                    "id": "value",
                    "uid": "GAUL_ReferenceArea",
                    "version": "1.0",
                    "url": "http://fenix.fao.org/d3s_fenix/msd/codes/filter"
                },
                "rendering": {
                    "displayMember": "label",
                    "valueMember": "value",
                    "multiple": true,
                    "width": "100%",
                    "height": "100%"
                }
            }
        },
        "sector": {
            "id": "fx-sector-id",
            "type": "sector",
            "cssclass": "fx-catalog-mod-timerseries",
            "container": "sector-container",
            "label": {
                "EN": "Sector",
                "ES": "Intervalo de tiempo",
                "DE": "Zeitbereich",
                "FR": "Intervalle de temps"
            },
            "details": {
                "cl": {
                    "uid": "UNECA_ClassificationOfActivities"
                }
            },
            "component": {
                "source": {
                    "datafields": [
                        {
                            "name": "label",
                            "map": "title>EN"
                        },
                        {
                            "name": "value",
                            "map": "code"
                        }
                    ],
                    "id": "value",
                    "uid": "CSTAT_Core",
                    "url": "http://fenix.fao.org/d3s_fenix/msd/codes/filter"
                },
                "rendering": {
                    "displayMember": "label",
                    "valueMember": "value",
                    "multiple": true,
                    "width": "100%",
                    "height": "100%"
                }
            }
        },
        "region": {
            "id": "fx-region-id",
            "type": "region",
            "cssclass": "region-css",
            "container": "region-container",
            "label": {
                "EN": "Region",
                "ES": "ES List",
                "FR": "FR List"
            },
            "details": {
                "cl": {
                    "uid": "GAUL0",
                    "version": "2014"
                }
            },
            "component": {
                "source": {
                    "datafields": [
                        {
                            "name": "label",
                            "map": "title>EN"
                        },
                        {
                            "name": "value",
                            "map": "code"
                        }
                    ],
                    "uid": "GAUL0",
                    "version": "2014",
                    "url": "http://fenix.fao.org/d3s_fenix/msd/codes/filter"
                },
                "rendering": {
                    "displayMember": "label",
                    "valueMember": "value",
                    "multiple": true,
                    "width": "100%",
                    "height": "100%"
                }
            }
        },
        "contact": {
            "id": "fx-contact-id",
            "type": "contact",
            "container": "contact-container",
            "cssclass": "contact",
            "label": {
                "EN": "Contact",
                "DE": "Suche",
                "ES": "Búsqueda",
                "FR": "Recherchet"
            },
            "details": {
                "cl": {
                    "uid": "ResponsiblePartyRole"
                }
            },
            "component": {
                "source": {
                    "url": "http://fenix.fao.org/d3s_fenix/msd/choices/ResponsiblePartyRole"
                },
                "rendering": {
                    "displayMember": "label",
                    "valueMember": "value",
                    "multiple": true,
                    "width": "100%",
                    "height": "100%"
                }

            }
        },
        "statusOfConfidentiality": {
            "id": "fx-statusOfConfidentiality-id",
            "type": "statusOfConfidentiality",
            "cssclass": "fx-catalog-mod-timerseries",
            "container": "statusOfConfidentiality-container",
            "label": {
                "EN": "Status of Confidentiality",
                "ES": "Intervalo de tiempo",
                "DE": "Zeitbereich",
                "FR": "Intervalle de temps"
            },
            "details": {
                "cl": {
                    "uid": "CL_CONF_STATUS",
                    "version": "1.0"
                }
            },
            "component": {
                "source": {
                    "datafields": [
                        {
                            "name": "label",
                            "map": "title>EN"
                        },
                        {
                            "name": "value",
                            "map": "code"
                        }
                    ],
                    "id": "value",
                    "uid": "CL_CONF_STATUS",
                    "version": "1.0",
                    "url": "http://fenix.fao.org/d3s_fenix/msd/codes/filter"
                },
                "rendering": {
                    "displayMember": "label",
                    "valueMember": "value",
                    "multiple": true,
                    "width": "100%",
                    "height": "100%"
                }
            }
        }

    };

});


