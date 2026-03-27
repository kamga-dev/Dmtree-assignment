export type Sprache = "de" | "en" | "fr" | "es";

export const SPRACHEN = [
  { code: "de", label: "Deutsch",  flag: "🇩🇪" },
  { code: "en", label: "English",  flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español",  flag: "🇪🇸" },
] as const;

export const uebersetzungen = {
  // ── Navigation ──────────────────────────────────────────────
  nav: {
    posts:      { de: "Beiträge",      en: "Posts",           fr: "Publications",  es: "Publicaciones" },
    newPost:    { de: "Neuer Beitrag", en: "New Post",        fr: "Nouvelle pub.", es: "Nueva pub."    },
    channels:   { de: "Kanäle",        en: "Channels",        fr: "Canaux",        es: "Canales"       },
    admin:      { de: "Verwaltung",    en: "Administration",  fr: "Administration",es: "Administración"},
    adminPanel: { de: "Admin-Panel",   en: "Admin Panel",     fr: "Panel Admin",   es: "Panel Admin"   },
    signOut:    { de: "Abmelden",      en: "Sign out",        fr: "Se déconnecter",es: "Cerrar sesión" },
    profile:    { de: "Mein Profil",  en: "My Profile",      fr: "Mon profil",    es: "Mi perfil"     },
  },

  // ── Auth ─────────────────────────────────────────────────────
  auth: {
    signIn:           { de: "Anmelden",                       en: "Sign in",                     fr: "Se connecter",             es: "Iniciar sesión"             },
    signInAccount:    { de: "Melde dich in deinem Konto an",  en: "Sign in to your account",     fr: "Connecte-toi à ton compte", es: "Inicia sesión en tu cuenta" },
    signingIn:        { de: "Wird angemeldet…",               en: "Signing in…",                 fr: "Connexion…",               es: "Iniciando sesión…"          },
    noAccount:        { de: "Noch kein Konto?",               en: "No account yet?",             fr: "Pas encore de compte ?",   es: "¿Sin cuenta todavía?"      },
    registerNow:      { de: "Jetzt registrieren",             en: "Register now",                fr: "S'inscrire",               es: "Registrarse"                },
    register:         { de: "Registrieren",                   en: "Register",                    fr: "S'inscrire",               es: "Registrarse"                },
    createAccount:    { de: "Erstelle dein Konto",            en: "Create your account",         fr: "Crée ton compte",          es: "Crea tu cuenta"             },
    creatingAccount:  { de: "Konto wird erstellt…",           en: "Creating account…",           fr: "Création du compte…",      es: "Creando cuenta…"            },
    createAccountBtn: { de: "Konto erstellen",                en: "Create account",              fr: "Créer mon compte",         es: "Crear cuenta"               },
    alreadyAccount:   { de: "Bereits ein Konto?",             en: "Already have an account?",    fr: "Déjà un compte ?",         es: "¿Ya tienes cuenta?"         },
    signInNow:        { de: "Jetzt anmelden",                 en: "Sign in now",                 fr: "Se connecter",             es: "Iniciar sesión"             },
    email:            { de: "E-Mail",                         en: "Email",                       fr: "E-mail",                   es: "Correo electrónico"         },
    password:         { de: "Passwort",                       en: "Password",                    fr: "Mot de passe",             es: "Contraseña"                 },
    confirmPassword:  { de: "Passwort bestätigen",            en: "Confirm password",            fr: "Confirmer le mot de passe",es: "Confirmar contraseña"       },
    fullName:         { de: "Vollständiger Name",             en: "Full name",                   fr: "Nom complet",              es: "Nombre completo"            },
    demoAccounts:     { de: "Demo-Zugangsdaten:",             en: "Demo accounts:",              fr: "Comptes démo :",           es: "Cuentas de demo:"           },
    passwordMin:      { de: "Mindestens 6 Zeichen",           en: "Min. 6 characters",           fr: "Min. 6 caractères",        es: "Mín. 6 caracteres"          },
    yourName:         { de: "Dein Name",                      en: "Your name",                   fr: "Ton prénom",              es: "Tu nombre"                  },
    errPasswordMatch: { de: "Die Passwörter stimmen nicht überein", en: "Passwords do not match", fr: "Les mots de passe ne correspondent pas", es: "Las contraseñas no coinciden" },
    errPasswordShort: { de: "Das Passwort muss mindestens 6 Zeichen lang sein", en: "Password must be at least 6 characters", fr: "Le mot de passe doit contenir au moins 6 caractères", es: "La contraseña debe tener al menos 6 caracteres" },
    errGeneric:             { de: "Etwas ist schiefgelaufen. Bitte versuche es erneut.", en: "Something went wrong. Please try again.",       fr: "Une erreur s'est produite. Réessaie.",          es: "Algo salió mal. Inténtalo de nuevo."          },
    errFieldsRequired:      { de: "E-Mail und Passwort sind erforderlich.",            en: "Email and password are required.",              fr: "E-mail et mot de passe sont requis.",           es: "El correo y la contraseña son obligatorios."  },
    errInvalidCredentials:  { de: "Ungültige E-Mail oder falsches Passwort.",          en: "Invalid email or incorrect password.",           fr: "E-mail ou mot de passe incorrect.",             es: "Correo o contraseña incorrectos."             },
    needHelp:         { de: "Brauchst du Hilfe?",                                  en: "Need help?",                              fr: "Besoin d'aide ?",                      es: "¿Necesitas ayuda?"                  },
    forgotPassword:     { de: "Passwort vergessen?",                                   en: "Forgot password?",                          fr: "Mot de passe oublié ?",                  es: "¿Olvidaste tu contraseña?"            },
    forgotPasswordDesc: { de: "Gib deine E-Mail ein und wir senden dir einen Link.", en: "Enter your email and we'll send you a link.", fr: "Entre ton e-mail, on t'envoie un lien.",  es: "Ingresa tu email y te enviaremos un enlace." },
    forgotEmail:        { de: "E-Mail-Adresse vergessen?",                           en: "Forgot your email?",                        fr: "E-mail oublié ?",                        es: "¿Olvidaste tu correo?"                },
    forgotEmailDesc:    { de: "Gib deinen Namen ein, wir helfen dir weiter.",        en: "Enter your name and we'll help you recover.", fr: "Entre ton nom, on t'aide à retrouver.",  es: "Ingresa tu nombre y te ayudaremos."    },
    sendResetLink:      { de: "Link senden",                                         en: "Send reset link",                           fr: "Envoyer le lien",                        es: "Enviar enlace"                        },
    sendingLink:        { de: "Wird gesendet…",                                      en: "Sending…",                                  fr: "Envoi en cours…",                        es: "Enviando…"                            },
    sendRequest:        { de: "Anfrage senden",                                      en: "Send request",                              fr: "Envoyer la demande",                     es: "Enviar solicitud"                     },
    sendingRequest:     { de: "Wird gesendet…",                                      en: "Sending…",                                  fr: "Envoi en cours…",                        es: "Enviando…"                            },
    checkYourEmail:     { de: "Schau in dein Postfach!",                             en: "Check your inbox!",                         fr: "Vérifie ta boîte mail !",                es: "¡Revisa tu bandeja de entrada!"       },
    resetLinkSent:      { de: "Wir haben einen Link gesendet an",                    en: "We've sent a reset link to",                fr: "Nous avons envoyé un lien à",            es: "Hemos enviado un enlace a"            },
    requestReceived:    { de: "Anfrage erhalten!",                                   en: "Request received!",                         fr: "Demande reçue !",                        es: "¡Solicitud recibida!"                 },
    emailRecoveryInfo:  { de: "Unser Team wird deine E-Mail-Adresse suchen und dich kontaktieren.", en: "Our team will look up your account and get in touch.", fr: "Notre équipe va rechercher ton compte et te contacter.", es: "Nuestro equipo buscará tu cuenta y se pondrá en contacto." },
    backToLogin:        { de: "Zurück zur Anmeldung",                                en: "Back to login",                             fr: "Retour à la connexion",                  es: "Volver al inicio de sesión"           },
  },

  // ── Feed ─────────────────────────────────────────────────────
  feed: {
    title:      { de: "Community-Feed",  en: "Community Feed",  fr: "Fil communautaire", es: "Feed de la comunidad" },
    posts:      { de: "Beiträge",        en: "posts",           fr: "publications",       es: "publicaciones"        },
    post:       { de: "Beitrag",         en: "post",            fr: "publication",        es: "publicación"          },
    noPosts:    { de: "Noch keine Beiträge vorhanden. Sei der Erste!", en: "No posts yet. Be the first!", fr: "Aucune publication. Sois le premier !", es: "Aún no hay publicaciones. ¡Sé el primero!" },
    noResults:  { de: "Keine Ergebnisse für",  en: "No results for",  fr: "Aucun résultat pour",  es: "Sin resultados para"  },
    search:     { de: "Beiträge suchen…",      en: "Search posts…",   fr: "Rechercher…",           es: "Buscar publicaciones…" },
    prevPage:   { de: "Zurück",                en: "Previous",        fr: "Précédent",             es: "Anterior"              },
    nextPage:   { de: "Weiter",                en: "Next",            fr: "Suivant",               es: "Siguiente"             },
    pageOf:     { de: "von",                   en: "of",              fr: "sur",                   es: "de"                    },
  },

  // ── Kategorien ───────────────────────────────────────────────
  cat: {
    all:     { de: "Alle",       en: "All",      fr: "Tout",      es: "Todo"       },
    news:    { de: "Neuigkeiten",en: "News",     fr: "Actualités",es: "Noticias"   },
    ideas:   { de: "Ideen",      en: "Ideas",    fr: "Idées",     es: "Ideas"      },
    general: { de: "Allgemein",  en: "General",  fr: "Général",   es: "General"    },
    newsBadge:   { de: "Neuigkeit", en: "News",  fr: "Actualité", es: "Noticia"    },
    ideaBadge:   { de: "Idee",      en: "Idea",  fr: "Idée",      es: "Idea"       },
    generalBadge:{ de: "Allgemein", en: "General",fr: "Général",  es: "General"    },
  },

  // ── Sortierung ───────────────────────────────────────────────
  sort: {
    hot: { de: "Beliebt", en: "Hot",  fr: "Populaire", es: "Popular" },
    new: { de: "Neu",     en: "New",  fr: "Nouveau",   es: "Nuevo"   },
    top: { de: "Top",     en: "Top",  fr: "Top",       es: "Top"     },
  },

  // ── Beitrag ──────────────────────────────────────────────────
  post: {
    pinned:         { de: "Angepinnt",               en: "Pinned",              fr: "Épinglé",                es: "Fijado"                  },
    comments:       { de: "Kommentare",              en: "comments",            fr: "commentaires",           es: "comentarios"             },
    comment:        { de: "Kommentar",               en: "comment",             fr: "commentaire",            es: "comentario"              },
    backToFeed:     { de: "Zurück zum Feed",         en: "Back to feed",        fr: "Retour au fil",          es: "Volver al feed"          },
    by:             { de: "von",                     en: "by",                  fr: "par",                    es: "por"                     },
    likeTitle:      { de: "Gefällt mir",             en: "Like",                fr: "J'aime",                 es: "Me gusta"                },
    dislikeTitle:   { de: "Gefällt mir nicht",       en: "Dislike",             fr: "Je n'aime pas",          es: "No me gusta"             },
    delete:         { de: "Löschen",                 en: "Delete",              fr: "Supprimer",              es: "Eliminar"                },
    confirmDelete:  { de: "Beitrag wirklich löschen?", en: "Delete this post?", fr: "Supprimer cette publication ?", es: "¿Eliminar esta publicación?" },
    edit:           { de: "Bearbeiten",               en: "Edit",                fr: "Modifier",               es: "Editar"                  },
    save:           { de: "Speichern",                en: "Save",                fr: "Enregistrer",            es: "Guardar"                 },
    saving:         { de: "Wird gespeichert…",        en: "Saving…",             fr: "Enregistrement…",        es: "Guardando…"              },
    cancel:         { de: "Abbrechen",                en: "Cancel",              fr: "Annuler",                es: "Cancelar"                },
  },

  // ── Neuer Beitrag ─────────────────────────────────────────────
  newPost: {
    title:          { de: "Neuer Beitrag",                    en: "New Post",                   fr: "Nouvelle publication",          es: "Nueva publicación"             },
    category:       { de: "Kategorie",                        en: "Category",                   fr: "Catégorie",                     es: "Categoría"                     },
    postTitle:      { de: "Titel",                            en: "Title",                      fr: "Titre",                         es: "Título"                        },
    content:        { de: "Inhalt",                           en: "Content",                    fr: "Contenu",                       es: "Contenido"                     },
    titlePlaceholder:{ de: "Worum geht es?",                  en: "What's on your mind?",       fr: "De quoi s'agit-il ?",           es: "¿De qué trata?"                },
    contentPlaceholder:{ de: "Beschreibe deinen Beitrag ausführlich…", en: "Share the details…", fr: "Décris ta publication…",       es: "Describe tu publicación…"      },
    publish:        { de: "Beitrag veröffentlichen",          en: "Publish post",               fr: "Publier la publication",        es: "Publicar"                      },
    publishing:     { de: "Wird veröffentlicht…",             en: "Publishing…",                fr: "Publication en cours…",         es: "Publicando…"                   },
    cancel:         { de: "Abbrechen",                        en: "Cancel",                     fr: "Annuler",                       es: "Cancelar"                      },
    newsDesc:       { de: "Ankündigungen & Updates",          en: "Announcements & updates",    fr: "Annonces & mises à jour",       es: "Anuncios y actualizaciones"    },
    ideasDesc:      { de: "Vorschläge & Verbesserungen",      en: "Suggestions & improvements", fr: "Suggestions & améliorations",   es: "Sugerencias y mejoras"         },
    generalDesc:    { de: "Alles andere",                     en: "Anything else",              fr: "Tout le reste",                 es: "Todo lo demás"                 },
    errRequired:    { de: "Titel und Inhalt sind erforderlich", en: "Title and content are required", fr: "Titre et contenu requis", es: "Título y contenido son obligatorios" },
  },

  // ── Kommentare ───────────────────────────────────────────────
  comments: {
    title:          { de: "Kommentare",                       en: "Comments",                   fr: "Commentaires",                  es: "Comentarios"                   },
    placeholder:    { de: "Schreibe einen Kommentar…",        en: "Write a comment…",           fr: "Écris un commentaire…",         es: "Escribe un comentario…"        },
    submit:         { de: "Kommentar absenden",               en: "Post comment",               fr: "Publier le commentaire",        es: "Publicar comentario"           },
    submitting:     { de: "Wird gespeichert…",                en: "Saving…",                    fr: "Enregistrement…",               es: "Guardando…"                    },
    empty:          { de: "Noch keine Kommentare. Starte die Diskussion!", en: "No comments yet. Start the discussion!", fr: "Aucun commentaire. Lance la discussion !", es: "Sin comentarios. ¡Inicia la discusión!" },
    signInTo:       { de: "Anmelden",                         en: "Sign in",                    fr: "Connecte-toi",                  es: "Inicia sesión"                 },
    toComment:      { de: "um zu kommentieren",               en: "to comment",                 fr: "pour commenter",                es: "para comentar"                 },
    delete:         { de: "Löschen",                          en: "Delete",                     fr: "Supprimer",                     es: "Eliminar"                      },
    deleting:       { de: "Wird gelöscht…",                   en: "Deleting…",                  fr: "Suppression…",                  es: "Eliminando…"                   },
    confirmDelete:  { de: "Kommentar löschen?",               en: "Delete this comment?",       fr: "Supprimer ce commentaire ?",    es: "¿Eliminar este comentario?"    },
  },

  // ── Chat ─────────────────────────────────────────────────────
  chat: {
    placeholder:    { de: "Nachricht schreiben…",             en: "Write a message…",           fr: "Écrire un message…",            es: "Escribe un mensaje…"           },
    empty:          { de: "Noch keine Nachrichten. Sag Hallo!", en: "No messages yet. Say hello!", fr: "Aucun message. Dis bonjour !", es: "Sin mensajes. ¡Di hola!"       },
    signInTo:       { de: "Anmelden",                         en: "Sign in",                    fr: "Connecte-toi",                  es: "Inicia sesión"                 },
    toSend:         { de: "um Nachrichten zu senden",         en: "to send messages",           fr: "pour envoyer des messages",     es: "para enviar mensajes"          },
    noChannels:     { de: "Noch keine Kanäle vorhanden. Bitte einen Administrator um Hilfe.", en: "No channels yet. Please contact an administrator.", fr: "Aucun canal disponible. Contacte un administrateur.", es: "Sin canales disponibles. Contacta a un administrador." },
    online:         { de: "Online",                           en: "Online",                     fr: "En ligne",                      es: "En línea"                      },
  },

  // ── Admin ────────────────────────────────────────────────────
  admin: {
    title:          { de: "Admin-Panel",                      en: "Admin Panel",                fr: "Panel d'administration",        es: "Panel de administración"       },
    subtitle:       { de: "Benutzer, Beiträge und Kanäle verwalten", en: "Manage users, posts and channels", fr: "Gérer les utilisateurs, publications et canaux", es: "Gestionar usuarios, publicaciones y canales" },
    users:          { de: "Benutzer",                         en: "Users",                      fr: "Utilisateurs",                  es: "Usuarios"                      },
    posts:          { de: "Beiträge",                         en: "Posts",                      fr: "Publications",                  es: "Publicaciones"                 },
    channels:       { de: "Kanäle",                           en: "Channels",                   fr: "Canaux",                        es: "Canales"                       },
    messages:       { de: "Nachrichten",                      en: "Messages",                   fr: "Messages",                      es: "Mensajes"                      },
    pin:            { de: "Anpinnen",                         en: "Pin",                        fr: "Épingler",                      es: "Fijar"                         },
    unpin:          { de: "Lösen",                            en: "Unpin",                      fr: "Désépingler",                   es: "Desfijar"                      },
    delete:         { de: "Löschen",                          en: "Delete",                     fr: "Supprimer",                     es: "Eliminar"                      },
    makeAdmin:      { de: "Zum Admin machen",                 en: "Make admin",                 fr: "Rendre admin",                  es: "Hacer admin"                   },
    removeAdmin:    { de: "Admin entfernen",                  en: "Remove admin",               fr: "Retirer admin",                 es: "Quitar admin"                  },
    administrator:  { de: "Administrator",                    en: "Administrator",              fr: "Administrateur",                es: "Administrador"                 },
    member:         { de: "Mitglied",                         en: "Member",                     fr: "Membre",                       es: "Miembro"                       },
    joined:         { de: "Beigetreten",                      en: "Joined",                     fr: "Inscrit",                       es: "Ingresó"                       },
    newChannel:     { de: "Neuen Kanal erstellen",            en: "Create new channel",         fr: "Créer un nouveau canal",        es: "Crear nuevo canal"             },
    channelName:    { de: "kanal-name",                       en: "channel-name",               fr: "nom-du-canal",                  es: "nombre-canal"                  },
    description:    { de: "Beschreibung (optional)",          en: "Description (optional)",     fr: "Description (optionnelle)",     es: "Descripción (opcional)"        },
    create:         { de: "Erstellen",                        en: "Create",                     fr: "Créer",                         es: "Crear"                         },
    noDescription:  { de: "Keine Beschreibung",              en: "No description",             fr: "Aucune description",            es: "Sin descripción"               },
    confirmDelete:  { de: "Beitrag löschen?",                 en: "Delete this post?",          fr: "Supprimer cette publication ?", es: "¿Eliminar esta publicación?"   },
    confirmDelChan: { de: "Kanal und alle Nachrichten löschen?", en: "Delete channel and all messages?", fr: "Supprimer le canal et tous les messages ?", es: "¿Eliminar canal y todos los mensajes?" },
    confirmRole:    { de: "Rolle ändern?",                    en: "Change role?",               fr: "Changer le rôle ?",             es: "¿Cambiar el rol?"              },
    votes:          { de: "Stimmen",                          en: "votes",                      fr: "votes",                         es: "votos"                         },
  },

  // ── Profil ───────────────────────────────────────────────────
  profile: {
    title:      { de: "Mein Profil",             en: "My Profile",            fr: "Mon profil",              es: "Mi perfil"               },
    myPosts:    { de: "Meine Beiträge",          en: "My Posts",              fr: "Mes publications",        es: "Mis publicaciones"       },
    noPosts:    { de: "Noch keine Beiträge.",    en: "No posts yet.",         fr: "Aucune publication.",     es: "Sin publicaciones."      },
    member:     { de: "Mitglied seit",           en: "Member since",          fr: "Membre depuis",           es: "Miembro desde"           },
    role:       { de: "Rolle",                   en: "Role",                  fr: "Rôle",                    es: "Rol"                     },
  },

  // ── Benachrichtigungen ───────────────────────────────────────
  notif: {
    title:       { de: "Benachrichtigungen",              en: "Notifications",               fr: "Notifications",                 es: "Notificaciones"                },
    empty:       { de: "Keine neuen Benachrichtigungen",  en: "No new notifications",        fr: "Aucune nouvelle notification",  es: "Sin nuevas notificaciones"     },
    markRead:    { de: "Alle als gelesen markieren",      en: "Mark all as read",            fr: "Tout marquer comme lu",         es: "Marcar todo como leído"        },
    commented:      { de: "hat deinen Beitrag kommentiert",     en: "commented on your post",        fr: "a commenté ta publication",       es: "comentó tu publicación"          },
    alsoCommented:  { de: "hat auch einen Kommentar hinterlassen", en: "also left a comment",          fr: "a aussi laissé un commentaire",   es: "también dejó un comentario"      },
    upvoted:        { de: "hat deinen Beitrag geliked",           en: "liked your post",               fr: "a aimé ta publication",           es: "le gustó tu publicación"         },
    downvoted:      { de: "hat deinen Beitrag disliked",          en: "disliked your post",            fr: "n'a pas aimé ta publication",     es: "no le gustó tu publicación"      },
    postedNew:      { de: "hat einen neuen Beitrag veröffentlicht", en: "published a new post",        fr: "a publié une nouvelle publication", es: "publicó una nueva entrada"      },
  },

  // ── Zeit ─────────────────────────────────────────────────────
  time: {
    justNow:  { de: "gerade eben",  en: "just now",   fr: "à l'instant",  es: "ahora mismo"  },
    minAgo:   { de: "vor",          en: "before",     fr: "il y a",       es: "hace"         },
    min:      { de: "Min.",         en: "min",        fr: "min",          es: "min"          },
    hours:    { de: "Std.",         en: "h",          fr: "h",            es: "h"            },
    days:     { de: "Tag",          en: "day",        fr: "jour",         es: "día"          },
    daysPlur: { de: "Tagen",        en: "days",       fr: "jours",        es: "días"         },
  },
} as const;

// Mapping für bekannte System-Kanalnamen
const kanalNamenMap: Record<string, Record<Sprache, string>> = {
  allgemein:      { de: "Allgemein",      en: "General",       fr: "Général",    es: "General"   },
  ankuendigungen: { de: "Ankündigungen",  en: "Announcements", fr: "Annonces",   es: "Anuncios"  },
  ideen:          { de: "Ideen",          en: "Ideas",         fr: "Idées",      es: "Ideas"     },
};

export function translateKanalName(name: string, sprache: Sprache): string {
  return kanalNamenMap[name]?.[sprache] ?? name;
}

export type UebersetzungsSchluessel = keyof typeof uebersetzungen;

export function t(
  bereich: UebersetzungsSchluessel,
  schluessel: string,
  sprache: Sprache = "de"
): string {
  const bereichObj = uebersetzungen[bereich] as Record<string, Record<Sprache, string>>;
  return bereichObj?.[schluessel]?.[sprache] ?? bereichObj?.[schluessel]?.["de"] ?? schluessel;
}

export function formatiereDatumI18n(datum: Date | string, sprache: Sprache): string {
  const d = new Date(datum);
  const jetzt = new Date();
  const diffMs = jetzt.getTime() - d.getTime();
  const diffSek = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSek / 60);
  const diffStd = Math.floor(diffMin / 60);
  const diffTage = Math.floor(diffStd / 24);

  const s = uebersetzungen.time;

  if (diffSek < 60) return s.justNow[sprache];
  if (diffMin < 60) return `${s.minAgo[sprache]} ${diffMin} ${s.min[sprache]}`;
  if (diffStd < 24) return `${s.minAgo[sprache]} ${diffStd} ${s.hours[sprache]}`;
  if (diffTage < 7) {
    const wort = diffTage === 1 ? s.days[sprache] : s.daysPlur[sprache];
    return `${s.minAgo[sprache]} ${diffTage} ${wort}`;
  }

  return d.toLocaleDateString(
    sprache === "de" ? "de-DE" : sprache === "fr" ? "fr-FR" : sprache === "es" ? "es-ES" : "en-GB",
    { year: "numeric", month: "short", day: "numeric" }
  );
}