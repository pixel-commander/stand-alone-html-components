import './styles.css';

export type ImageUploadProps = {
  data?: Record<string, unknown>[];
  className?: string;
  src?: ((...args: never[]) => void) | null;
  handleUpload?: ((...args: never[]) => void) | null;
};

export function ImageUpload({
  data = [],
  className,
  src = undefined,
  handleUpload = undefined,
}: ImageUploadProps) {
  return (
    <>
      <div className="image-upload">
        <header data-area="header"></header>
        <img data-area="main" alt="" />
        <button type="button" aria-label="Remove image">×</button>
        <a data-area="footer" href="#"></a>
        <input type="file" accept="image/*" />
      </div>
    </>
  );
}

export default ImageUpload;
