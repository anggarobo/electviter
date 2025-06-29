**Main Process**
================

This folder contains the main process code for the Electron application. The main process is responsible for creating and managing the application's windows, handling system events, and providing a bridge between the renderer processes and the operating system.

**Overview**
------------

The main process is the entry point of the Electron application, and it is responsible for:

* Creating and managing the application's windows
* Handling system events, such as window close and minimize events
* Providing a bridge between the renderer processes and the operating system
* Exposing APIs to the renderer processes for interacting with the operating system

**Files**
--------

* `main.js`: The entry point of the main process, responsible for creating and managing the application's windows and handling system events.
* `preload.js`: A script that is loaded before the main window's HTML file, used to expose APIs to the renderer process.

**Note**
-------

This folder should only contain code that is specific to the main process. Renderer process code should be placed in the renderer folder.