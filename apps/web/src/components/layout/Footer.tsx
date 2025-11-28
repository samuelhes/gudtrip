import { APP_VERSION } from '../../config/version';

export const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
            <div className="container mx-auto px-4 text-center">
                <p className="text-gray-500 text-sm">
                    Gudtrip v{APP_VERSION}
                </p>
            </div>
        </footer>
    );
};
