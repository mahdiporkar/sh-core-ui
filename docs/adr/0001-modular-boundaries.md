# ADR 0001: Modular boundaries in one package

Status: accepted

The initial version is one npm package with explicit subpath exports. Public modules own their contracts; internal adapters alone may import Ant Design or AG Grid. This supports lockstep versioning now and permits a future workspace split without changing consumer imports.
