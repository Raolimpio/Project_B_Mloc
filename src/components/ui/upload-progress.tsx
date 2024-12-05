import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface UploadProgressProps {
  progress: number;
  className?: string;
}

export function UploadProgress({ progress, className }: UploadProgressProps) {
  return (
    <div className={className}>
      <div className="h-16 w-16">
        <CircularProgressbar
          value={progress}
          text={`${progress}%`}
          styles={{
            path: {
              stroke: '#3B82F6',
              strokeLinecap: 'round',
            },
            trail: {
              stroke: '#E5E7EB',
            },
            text: {
              fill: '#3B82F6',
              fontSize: '24px',
              fontWeight: 'bold',
            },
          }}
        />
      </div>
      <p className="mt-2 text-center text-sm text-gray-600">
        Enviando imagem...
      </p>
    </div>
  );
}