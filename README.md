# Babbage Lite

**Babbage Lite** is an **Analytical Engine** interpreter based on a _certain professor's_ simplified lesson on Charles Babbage's Analytical Engine at _a certain university_. It is inspired by John Walker's [Analytical Engine Emulator](https://fourmilab.ch/babbage/emulator.html).

This interpreter aims to provide a simplified yet functional approach to understanding Babbage's design and its basic principles.

## Key Differences Between the Original Model & the Simplified Model

Below are some key differences between the original machine and the _certain professor's_ simplified model:

|                           | **Original Analytical Engine**                                                         | **Simplified Analytical Engine**                                                                            |
| :------------------------ | :------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| **Number Representation** | Has a decimal-based gear system where each gear represented a digit (0-9).             | Will handle real numbers of any size.                                                                       |
| **Registers & Memory**    | Includes 2 primed ingress axes and 1 primed egress axis for complex data manipulation. | Does not require primed ingress axes or primed egress axes.                                                 |
| **Run-Up Lever**          | Set when subtraction, addition differ in signs as well as division's divisor is 0.     | Set when subtraction, addition differ in signs (counting 0 as positive) as well as division's divisor is 0. |

## Examples

Sample programs demonstrating the interpreter's capabilities can be found in the [examples](./docs/examples) directory:

- **[prime_number.txt](./docs/examples/prime_number.txt)**
- **[repeated_subtraction.txt](./docs/examples/repeated_subtraction.txt)**

Feel free to use these as a starting point for writing your own Analytical Engine programs!

## Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository.
2. Create a new branch for your changes (`git checkout -b feature-xyz`).
3. Commit your changes (`git commit -m "feat: add feature-xyz"`).
4. Push to the branch (`git push origin feature-xyz`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
