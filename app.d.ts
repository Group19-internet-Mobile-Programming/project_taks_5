// Additional type definitions for the application

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';

// Extend the window object for framework ready
interface Window {
  frameworkReady?: () => void;
}