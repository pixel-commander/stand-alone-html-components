HOUSE_UTIL — dom helpers, and nothing that makes a design decision.

dom.js
  find / findAll     querySelector without the noise
  stateClass         is_active -> "is-active". The keyring's flags are snake,
                     the classes are kebab, and this is the one place that
                     conversion happens.
  setState           toggles one state class from one flag
  selectOne          moves a state class along a set, so exactly one carries it
  on                 addEventListener that hands back its own remover

Nothing here touches style, colour or layout. If a helper starts setting a
visual property, it belongs in a component's css instead.
