function useContainerSize(el, callback) {
  const size = { el, width: 0, height: 0 };

  if (!el) return size;

  const box = el.getBoundingClientRect();
  size.width = box.width;
  size.height = box.height;

  const observer = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;

    size.width = entry.contentRect.width;
    size.height = entry.contentRect.height;

    if (callback) callback(size);
  });

  observer.observe(el);

  return size;
}
