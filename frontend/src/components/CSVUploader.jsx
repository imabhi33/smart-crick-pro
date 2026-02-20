import { useState } from 'react';
import uploadService from '../services/upload.service';

const CSVUploader = ({ onPlayersUploaded, teamName }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (selectedFile) => {
        setError(null);

        // Validate file type
        if (!selectedFile.name.endsWith('.csv')) {
            setError('Please upload a CSV file');
            return;
        }

        // Validate file size (max 2MB)
        if (selectedFile.size > 2 * 1024 * 1024) {
            setError('File size must be less than 2MB');
            return;
        }

        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const result = await uploadService.uploadPlayerCSV(file);

            if (result.success) {
                // Pass full player objects (with roles) to parent
                onPlayersUploaded(result.data);
                setFile(null);
                setError(null);
            } else {
                setError(result.message || 'Failed to upload CSV');
            }
        } catch (err) {
            setError(err.message || 'Failed to upload CSV file');
        } finally {
            setUploading(false);
        }
    };

    const handleDownloadSample = async () => {
        try {
            await uploadService.downloadSampleCSV();
        } catch (err) {
            setError(err.message || 'Failed to download sample CSV');
        }
    };

    return (
        <div className="glass-effect p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold gradient-text">Upload Players - {teamName}</h3>
                <button
                    onClick={handleDownloadSample}
                    className="text-sm text-primary-blue hover:text-primary-green transition-colors"
                    title="Download sample CSV template"
                >
                    📥 Download Sample
                </button>
            </div>

            {/* Drag and Drop Zone */}
            <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive
                    ? 'border-primary-blue bg-primary-blue/10'
                    : 'border-white/20 hover:border-primary-blue/50'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="mb-4">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {file ? (
                    <div className="space-y-2">
                        <p className="text-primary-green font-semibold">✓ {file.name}</p>
                        <p className="text-sm text-gray-400">
                            {(file.size / 1024).toFixed(2)} KB
                        </p>
                        <div className="flex gap-2 justify-center mt-4">
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="btn-primary px-6 py-2"
                            >
                                {uploading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin">⏳</span> Uploading...
                                    </span>
                                ) : (
                                    'Upload & Parse'
                                )}
                            </button>
                            <button
                                onClick={() => setFile(null)}
                                className="btn-secondary px-6 py-2"
                                disabled={uploading}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="text-gray-300 mb-2">
                            <span className="font-semibold">Drop your CSV file here</span> or
                        </p>
                        <label className="cursor-pointer">
                            <span className="btn-primary inline-block px-6 py-2">
                                Browse Files
                            </span>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={(e) => handleFileChange(e.target.files[0])}
                                className="hidden"
                            />
                        </label>
                        <p className="text-xs text-gray-500 mt-4">
                            CSV file with player names (max 2MB)
                        </p>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                    <span className="font-semibold">Error:</span> {error}
                </div>
            )}

            {/* Instructions */}
            <div className="mt-4 p-4 bg-white/5 rounded-lg text-sm text-gray-400">
                <p className="font-semibold text-white mb-2">📝 CSV Format:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>Simple format: Just player names, one per line</li>
                    <li>Or use columns: Player Name, Role, Batting Style, Bowling Style</li>
                    <li>First row should contain headers</li>
                    <li>Minimum 11 players required</li>
                </ul>
            </div>
        </div>
    );
};

export default CSVUploader;
