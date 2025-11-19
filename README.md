# Babbage Lite

**Babbage Lite** is an **Analytical Engine** interpreter based on a *certain professor's* simplified lesson on Charles Babbage's Analytical Engine at *a certain university*. It is inspired by John Walker's [Analytical Engine Emulator](https://fourmilab.ch/babbage/emulator.html).

This interpreter aims to provide a simplified yet functional approach to understanding Babbage's design and its basic principles.

## Key Differences Between the Original Model & the Simplified Model

Below are some key differences between the original machine and the *certain professor's* simplified model:

|                           | **Original Analytical Engine**                                                         | **Simplified Analytical Engine**                                                  |
| :------------------------ | :------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **Number Representation** | Has a decimal-based gear system where each gear represented a digit (0-9).             | Will handle real numbers of any size.                                             |
| **Registers & Memory**    | Includes 2 primed ingress axes and 1 primed egress axis for complex data manipulation. | Does not use primed ingress axes or primed egress axes.                       |
| **Operation Cards**       | Includes addition, subtraction, multiplication, and division.                          | Also includes modulo due to not having primed ingress axes or primed egress axes. |

## Examples & Syntax

Sample programs demonstrating the interpreter's capabilities can be found in the **[examples](./docs/examples)** directory (feel free to modify/use these):

- [prime_number.ae](./docs/examples/prime_number.ae)
- [repeated_subtraction.ae](./docs/examples/repeated_subtraction.ae)

A quick-start syntax reference can be found in **[syntax.md](./docs/syntax.md)**.

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository.
2. Create a new branch for your changes (`git checkout -b feature-xyz`).
3. Commit your changes (`git commit -m "feat: add feature-xyz"`).
4. Push to the branch (`git push origin feature-xyz`).
5. Open a pull request.

## Acknowledgements

- Bell Sound by [Universfield](https://pixabay.com/users/universfield-28281460/) from [Pixabay](https://pixabay.com/)
- Idea inspired by John Walker's [Analytical Engine Emulator](https://fourmilab.ch/babbage/emulator.html) and my *certain professor* who made sure we understood him

> *"Do you follow?"*

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
