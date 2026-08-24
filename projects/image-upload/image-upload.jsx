const ImageUpload = ({ header = '', label = 'click here select an image', handleUpload = null, className = '' }) => {
  const [src, setSrc] = React.useState(null);
  const picker = React.useRef(null);

  React.useEffect(() => () => { if (src) URL.revokeObjectURL(src); }, [src]);

  const onPick = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (src) URL.revokeObjectURL(src);
    setSrc(URL.createObjectURL(file));
    if (handleUpload) handleUpload(file);
  };

  return (
    <div className={'image-upload relative grid justify-items-center gap-3 p-4 box-border max-w-[300px] max-h-[500px] ' + (src ? 'grid-rows-[auto_minmax(0,1fr)_auto] content-stretch ' : 'grid-rows-[auto_auto_auto] content-center ') + className}>
      {header && <header className="text-[15px] font-semibold">{header}</header>}

      {src && <img className="w-full h-auto" src={src} alt="" />}

      {src && (
        <button
          type="button"
          aria-label="Remove image"
          className="absolute top-0 right-0 w-6 h-6 border-0 rounded bg-black/55 text-white leading-none cursor-pointer"
          onClick={() => { URL.revokeObjectURL(src); setSrc(null); }}
        >
          ×
        </button>
      )}

      <a className="text-[#005eb8]" href="#" onClick={(event) => { event.preventDefault(); picker.current.click(); }}>
        {label}
      </a>

      <input className="hidden" type="file" accept="image/*" ref={picker} onChange={onPick} />
    </div>
  );
};
