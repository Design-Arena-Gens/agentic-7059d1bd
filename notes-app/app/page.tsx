import styles from "./page.module.css";

type CodeSample = {
  caption: string;
  content: string;
};

type Subtopic = {
  title: string;
  summary: string;
  notes?: string[];
  code?: CodeSample[];
};

type Topic = {
  title: string;
  summary: string;
  subtopics: Subtopic[];
};

const topics: Topic[] = [
  {
    title: "1. Array Fundamentals",
    summary:
      "Understand what arrays are in C, how they behave in memory, and why they are foundational for systems programming.",
    subtopics: [
      {
        title: "1.1 Definition and Characteristics",
        summary:
          "An array is a contiguous block of memory that stores elements of the same type. The array name often decays to a pointer to its first element, enabling pointer arithmetic.",
        notes: [
          "Arrays have a fixed size determined at compile time when declared with a constant expression length.",
          "Indexing starts at 0 and continues sequentially until size - 1.",
          "The compiler does not perform bounds checking, so accessing out-of-range indices causes undefined behavior.",
        ],
        code: [
          {
            caption: "Visualizing Array Layout",
            content: `#include <stdio.h>

int main(void) {
    int numbers[4] = {3, 6, 9, 12};

    printf("numbers: %p\\n", (void *)numbers);
    for (int i = 0; i < 4; ++i) {
        printf("numbers[%d] = %d at %p\\n", i, numbers[i], (void *)&numbers[i]);
    }

    return 0;
}`,
          },
        ],
      },
      {
        title: "1.2 Compile-Time vs. Run-Time Size",
        summary:
          "C requires the size of a standard array to be known at compile time, but C99 introduced Variable Length Arrays (VLAs) for stack allocation with run-time sizes.",
        notes: [
          "VLAs are optional in C11 and later; many compilers still support them, but portability may suffer.",
          "Stack size is limited; prefer dynamic allocation for large or unpredictable sizes.",
        ],
        code: [
          {
            caption: "Variable Length Array (VLA) Example",
            content: `#include <stdio.h>

void print_histogram(int count) {
    int bars[count]; // VLA: size determined at run time
    for (int i = 0; i < count; ++i) {
        bars[i] = i * i;
        printf("%d ", bars[i]);
    }
    puts(""); // newline
}

int main(void) {
    print_histogram(5);
    return 0;
}`,
          },
        ],
      },
    ],
  },
  {
    title: "2. Declaring and Initializing Arrays",
    summary:
      "Explore the syntax for declaring arrays, partial initializations, designated initializers, and how the compiler fills remaining elements.",
    subtopics: [
      {
        title: "2.1 Declaration Syntax",
        summary:
          "Array declarations specify the element type, the array name, and the number of elements enclosed in square brackets.",
        notes: [
          "`int scores[10];` declares space for ten `int` values initialized with indeterminate contents.",
          "You can declare and initialize simultaneously using curly braces.",
        ],
        code: [
          {
            caption: "Basic Declarations",
            content: `int primes[5];            // uninitialized
double temperature[365];   // element type double
char name[32] = "Ada";      // initialized with string literal`,
          },
        ],
      },
      {
        title: "2.2 Initializer Lists",
        summary:
          "Initializer lists allow explicit values. Missing elements are zero-initialized when using static storage duration or explicit initializer braces.",
        notes: [
          "When the array size is omitted, the compiler infers it from the number of initializer elements.",
          "Designated initializers assign values to specific indices while leaving others zeroed.",
        ],
        code: [
          {
            caption: "Inferred Length and Designated Initializers",
            content: `#include <stdio.h>

int main(void) {
    int fibonacci[] = {0, 1, 1, 2, 3, 5, 8};
    int weekdays[7] = {[0] = 1, [6] = 7};

    printf("fibonacci has %zu elements\\n", sizeof fibonacci / sizeof *fibonacci);
    for (size_t i = 0; i < 7; ++i) {
        printf("weekdays[%zu] = %d\\n", i, weekdays[i]);
    }
    return 0;
}`,
          },
        ],
      },
    ],
  },
  {
    title: "3. Memory Layout and Indexing",
    summary:
      "Understand how arrays occupy contiguous memory, how `sizeof` works, and practical indexing techniques.",
    subtopics: [
      {
        title: "3.1 Using sizeof Safely",
        summary:
          "`sizeof` helps compute array length within the same scope as the declaration. Passing arrays to functions removes size information.",
        notes: [
          "`sizeof array / sizeof array[0]` yields the number of elements when `array` is an actual array (not a pointer).",
          "Once an array decays to a pointer (e.g., when passed to a function), `sizeof` returns the pointer size instead.",
        ],
        code: [
          {
            caption: "Length Calculation Macro",
            content: `#include <stdio.h>

#define ARRAY_LEN(arr) ((int)(sizeof(arr) / sizeof((arr)[0])))

int main(void) {
    int data[] = {4, 8, 15, 16, 23, 42};
    printf("Length = %d\\n", ARRAY_LEN(data));
    return 0;
}`,
          },
        ],
      },
      {
        title: "3.2 Bounds Awareness",
        summary:
          "Because C lacks bounds checking, explicit guards are essential to prevent buffer overruns and undefined behavior.",
        notes: [
          "Always validate indices before use, especially when data originates from user input or external sources.",
          "Prefer iterating with unsigned types like `size_t` when dealing with sizes to avoid negative indices.",
        ],
        code: [
          {
            caption: "Safe Indexing Wrapper",
            content: `#include <stdbool.h>
#include <stdio.h>

bool array_get(const int *arr, size_t length, size_t index, int *out_value) {
    if (index >= length) {
        return false;
    }
    *out_value = arr[index];
    return true;
}

int main(void) {
    int values[] = {10, 20, 30, 40};
    int result;

    if (array_get(values, 4, 2, &result)) {
        printf("values[2] = %d\\n", result);
    } else {
        puts("Index out of range");
    }
    return 0;
}`,
          },
        ],
      },
    ],
  },
  {
    title: "4. Core Operations",
    summary:
      "Implement traversal, searching, inserting, and deleting elements using manual loops because arrays have fixed length.",
    subtopics: [
      {
        title: "4.1 Traversal and Aggregation",
        summary:
          "Use loop constructs to process every element. Aggregations like sum or average require iterating over the complete array.",
        notes: [
          "Prefer `size_t` for loop counters to match the type returned by `sizeof` computations.",
          "Do not assume arrays are null-terminated unless they represent C strings.",
        ],
        code: [
          {
            caption: "Sum and Average",
            content: `#include <stdio.h>

double average(const double *values, size_t length) {
    double total = 0.0;
    for (size_t i = 0; i < length; ++i) {
        total += values[i];
    }
    return length ? total / length : 0.0;
}

int main(void) {
    double samples[] = {2.5, 4.0, 3.5, 1.0};
    printf("Average = %.2f\\n", average(samples, sizeof samples / sizeof *samples));
    return 0;
}`,
          },
        ],
      },
      {
        title: "4.2 Searching",
        summary:
          "Linear search is straightforward. Binary search reduces complexity for sorted arrays but requires manual implementation or `<stdlib.h>` utilities.",
        notes: [
          "Return sentinel values (e.g., `-1`) or use `bool` outs to signal success.",
          "Remember to validate sorted preconditions when using binary search.",
        ],
        code: [
          {
            caption: "Linear Search Returning Index",
            content: `#include <stdio.h>

int find_index(const int *arr, size_t length, int target) {
    for (size_t i = 0; i < length; ++i) {
        if (arr[i] == target) {
            return (int)i;
        }
    }
    return -1;
}

int main(void) {
    int arr[] = {7, 2, 9, 4, 6};
    int index = find_index(arr, sizeof arr / sizeof *arr, 4);
    printf("index = %d\\n", index);
    return 0;
}`,
          },
        ],
      },
      {
        title: "4.3 Insertion and Deletion",
        summary:
          "Because arrays are fixed-size, insertion and deletion involve shifting elements. Track the logical length separately from capacity.",
        notes: [
          "Always check that there is capacity before inserting.",
          "When deleting, shift elements left and optionally zero the vacated slot for clarity.",
        ],
        code: [
          {
            caption: "Manual Insert With Capacity Tracking",
            content: `#include <stdio.h>
#include <stdbool.h>

#define CAPACITY 8

bool insert_at(int arr[], size_t *length, int value, size_t pos) {
    if (*length >= CAPACITY || pos > *length) {
        return false;
    }
    for (size_t i = *length; i > pos; --i) {
        arr[i] = arr[i - 1];
    }
    arr[pos] = value;
    (*length)++;
    return true;
}

int main(void) {
    int buffer[CAPACITY] = {1, 3, 5, 7, 9};
    size_t length = 5;

    insert_at(buffer, &length, 11, 2);

    for (size_t i = 0; i < length; ++i) {
        printf("%d ", buffer[i]);
    }
    puts("");
    return 0;
}`,
          },
        ],
      },
    ],
  },
  {
    title: "5. Multidimensional Arrays",
    summary:
      "C stores multidimensional arrays in row-major order. Subscripting cascades to access elements in nested arrays.",
    subtopics: [
      {
        title: "5.1 Declaration and Initialization",
        summary:
          "Each dimension size except the first must be specified when passing to functions. Initialization can flatten or nest braces.",
        notes: [
          "`int matrix[2][3]` allocates 2 rows with 3 columns each.",
          "Nested initializers clarify row boundaries and reduce mistakes.",
        ],
        code: [
          {
            caption: "2D Array Initialization",
            content: `#include <stdio.h>

int main(void) {
    int matrix[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };

    for (size_t row = 0; row < 2; ++row) {
        for (size_t col = 0; col < 3; ++col) {
            printf("%d ", matrix[row][col]);
        }
        puts("");
    }
    return 0;
}`,
          },
        ],
      },
      {
        title: "5.2 Passing Multidimensional Arrays",
        summary:
          "When passing to functions, all but the first dimension must be fixed so the compiler can compute row offsets.",
        notes: [
          "Use macros or `const` parameters to make dimensions explicit and maintain readability.",
          "Pointer syntax such as `int (*matrix)[3]` declares a pointer to an array of 3 integers.",
        ],
        code: [
          {
            caption: "Function Receiving 2D Array",
            content: `#include <stdio.h>

void print_board(size_t rows, size_t cols, const int board[rows][cols]) {
    for (size_t r = 0; r < rows; ++r) {
        for (size_t c = 0; c < cols; ++c) {
            printf("%d ", board[r][c]);
        }
        puts("");
    }
}

int main(void) {
    int board[3][3] = {
        {0, 1, 0},
        {1, 0, 1},
        {0, 1, 0}
    };
    print_board(3, 3, board);
    return 0;
}`,
          },
        ],
      },
    ],
  },
  {
    title: "6. Arrays and Pointers",
    summary:
      "Array names often decay to pointers, but arrays and pointers are not interchangeable. Understanding differences avoids subtle bugs.",
    subtopics: [
      {
        title: "6.1 Decay and Differences",
        summary:
          "An array's name converts to a pointer to its first element in most expressions, yet `sizeof` and address-of behave differently.",
        notes: [
          "`sizeof array` yields the entire array size, while `sizeof pointer` gives pointer size.",
          "`&array` has type pointer to array, distinct from pointer to first element.",
        ],
        code: [
          {
            caption: "Pointer vs. Array Demonstration",
            content: `#include <stdio.h>

int main(void) {
    int data[3] = {10, 20, 30};
    int *ptr = data;        // decay to pointer

    printf("sizeof data = %zu\\n", sizeof data);
    printf("sizeof ptr = %zu\\n", sizeof ptr);
    printf("data address = %p\\n", (void *)data);
    printf("&data address = %p\\n", (void *)&data);
    printf("ptr address = %p\\n", (void *)ptr);
    return 0;
}`,
          },
        ],
      },
      {
        title: "6.2 Pointer Arithmetic",
        summary:
          "Pointer arithmetic respects element size. Incrementing a pointer moves it by the size of the pointed-to type.",
        notes: [
          "Never increment past the array's end; keep sentinel pointers to `arr + length` as bounds.",
          "Pointer subtraction yields the number of elements between two pointers within the same array.",
        ],
        code: [
          {
            caption: "Iterating with Pointers",
            content: `#include <stdio.h>

void print_with_pointers(const int *begin, const int *end) {
    for (const int *it = begin; it < end; ++it) {
        printf("%d ", *it);
    }
    puts("");
}

int main(void) {
    int numbers[] = {2, 4, 6, 8, 10};
    print_with_pointers(numbers, numbers + (sizeof numbers / sizeof *numbers));
    return 0;
}`,
          },
        ],
      },
    ],
  },
  {
    title: "7. Strings as Character Arrays",
    summary:
      "C strings are arrays of `char` terminated by a null character (`'\\0'`). Handling them safely requires length checks.",
    subtopics: [
      {
        title: "7.1 Initialization and Literals",
        summary:
          "String literals automatically append the null terminator. Ensure arrays have space for it when specifying fixed sizes.",
        notes: [
          "`char word[] = \"C\";` creates a 2-element array: `{'C', '\\0'}`.",
          "When copying strings, use functions that limit writes, such as `snprintf` or `strncpy` (with manual terminator).",
        ],
        code: [
          {
            caption: "Safe String Copy Utility",
            content: `#include <stdio.h>
#include <string.h>

void copy_label(char *dest, size_t dest_size, const char *source) {
    if (dest_size == 0) {
        return;
    }
    snprintf(dest, dest_size, "%s", source);
}

int main(void) {
    char label[8];
    copy_label(label, sizeof label, "Arrays");
    printf("label = %s\\n", label);
    return 0;
}`,
          },
        ],
      },
      {
        title: "7.2 Iterating Over Strings",
        summary:
          "Terminate loops when the null character is encountered. Avoid overrunning buffers by checking maximum length.",
        notes: [
          "Use `size_t` counters and guard conditions to prevent reading beyond the buffer.",
          "For embedded nulls, treat data as raw arrays rather than C strings.",
        ],
        code: [
          {
            caption: "Manual strlen Implementation",
            content: `#include <stdio.h>

size_t my_strlen(const char *s) {
    const char *p = s;
    while (*p) {
        ++p;
    }
    return (size_t)(p - s);
}

int main(void) {
    const char message[] = "Array Notes";
    printf("Length = %zu\\n", my_strlen(message));
    return 0;
}`,
          },
        ],
      },
    ],
  },
  {
    title: "8. Dynamic Arrays",
    summary:
      "Use dynamic allocation for arrays whose size is known only at run time or exceeds stack limits.",
    subtopics: [
      {
        title: "8.1 malloc, calloc, and realloc",
        summary:
          "`malloc` allocates uninitialized memory, `calloc` zeroes it, and `realloc` resizes while preserving contents when possible.",
        notes: [
          "Always check allocation results against `NULL` before dereferencing.",
          "Pair each successful allocation with `free` to avoid memory leaks.",
        ],
        code: [
          {
            caption: "Resizable Dynamic Array",
            content: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    size_t length;
    size_t capacity;
} IntVector;

int vector_push(IntVector *vec, int value) {
    if (vec->length == vec->capacity) {
        size_t new_capacity = vec->capacity ? vec->capacity * 2 : 4;
        int *new_data = realloc(vec->data, new_capacity * sizeof *new_data);
        if (!new_data) {
            return -1;
        }
        vec->data = new_data;
        vec->capacity = new_capacity;
    }
    vec->data[vec->length++] = value;
    return 0;
}

void vector_free(IntVector *vec) {
    free(vec->data);
    vec->data = NULL;
    vec->length = vec->capacity = 0;
}

int main(void) {
    IntVector vec = {0};
    for (int i = 0; i < 10; ++i) {
        if (vector_push(&vec, i * i) != 0) {
            fprintf(stderr, "Allocation failure\\n");
            vector_free(&vec);
            return 1;
        }
    }
    for (size_t i = 0; i < vec.length; ++i) {
        printf("%d ", vec.data[i]);
    }
    puts("");
    vector_free(&vec);
    return 0;
}`,
          },
        ],
      },
      {
        title: "8.2 Flexible Array Members",
        summary:
          "A flexible array member is a struct's last element declared with empty brackets, enabling variable-sized trailing storage.",
        notes: [
          "Allocate memory with `sizeof(struct) + element_count * sizeof(type)`.",
          "Commonly used for packet parsing or compound objects that combine metadata with data payloads.",
        ],
        code: [
          {
            caption: "Flexible Array Member Pattern",
            content: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    size_t length;
    char text[];
} StringBlob;

StringBlob *stringblob_create(const char *source) {
    size_t len = strlen(source);
    StringBlob *blob = malloc(sizeof *blob + (len + 1) * sizeof(char));
    if (!blob) {
        return NULL;
    }
    blob->length = len;
    memcpy(blob->text, source, len + 1);
    return blob;
}

int main(void) {
    StringBlob *blob = stringblob_create("Contiguous arrays rock!");
    if (!blob) {
        return 1;
    }
    printf("Stored: %s (%zu chars)\\n", blob->text, blob->length);
    free(blob);
    return 0;
}`,
          },
        ],
      },
    ],
  },
  {
    title: "9. Arrays and Functions",
    summary:
      "Passing arrays to functions requires explicit size communication. `const` qualifiers document intent and enable more optimizations.",
    subtopics: [
      {
        title: "9.1 Function Parameters",
        summary:
          "Declaring parameters as `int arr[]`, `int arr[static N]`, or `int *arr` are equivalent, but qualifiers like `static` can instruct the compiler about minimum size.",
        notes: [
          "`static` in parameter declarations indicates that the pointer argument must address at least the specified number of elements.",
          "Use `restrict` in C99+ when pointers refer to non-overlapping objects to help vectorization.",
        ],
        code: [
          {
            caption: "Using static in Parameters",
            content: `#include <stddef.h>
#include <stdio.h>

void normalize(double values[static 4], size_t length) {
    double max = 0.0;
    for (size_t i = 0; i < length; ++i) {
        if (values[i] > max) {
            max = values[i];
        }
    }
    if (max == 0.0) {
        return;
    }
    for (size_t i = 0; i < length; ++i) {
        values[i] /= max;
    }
}

int main(void) {
    double metrics[] = {4.0, 8.0, 2.0, 6.0};
    normalize(metrics, sizeof metrics / sizeof *metrics);
    for (size_t i = 0; i < sizeof metrics / sizeof *metrics; ++i) {
        printf("%.2f ", metrics[i]);
    }
    puts("");
    return 0;
}`,
          },
        ],
      },
      {
        title: "9.2 Returning Arrays",
        summary:
          "Functions cannot return arrays directly, but you can return pointers to static storage, dynamically allocated memory, or wrap arrays in structs.",
        notes: [
          "Returning pointers to local arrays is undefined because the storage ceases to exist after the function exits.",
          "Struct wrappers provide value semantics and can be copied or returned safely.",
        ],
        code: [
          {
            caption: "Struct Wrapper Return",
            content: `#include <stdio.h>

typedef struct {
    double values[3];
} Triple;

Triple make_unit_vector(void) {
    Triple t = {{1.0, 0.0, 0.0}};
    return t;
}

int main(void) {
    Triple x = make_unit_vector();
    printf("(%.1f, %.1f, %.1f)\\n", x.values[0], x.values[1], x.values[2]);
    return 0;
}`,
          },
        ],
      },
    ],
  },
  {
    title: "10. Best Practices and Common Pitfalls",
    summary:
      "Finish with patterns and guidelines to write safer, more maintainable code when working with arrays in C.",
    subtopics: [
      {
        title: "10.1 Best Practices Checklist",
        summary:
          "Apply these heuristics to make array usage more robust, self-documenting, and efficient.",
        notes: [
          "Encapsulate array logic in helper functions that take lengths explicitly.",
          "Favor `const` where possible to signal read-only intent.",
          "Use enums or macros to centralize array sizes and prevent mismatches.",
          "Prefer standard library algorithms (`qsort`, `bsearch`) when they fit the task.",
        ],
      },
      {
        title: "10.2 Common Mistakes to Avoid",
        summary:
          "Recognize recurring pitfalls and undefined behaviors associated with array misuse.",
        notes: [
          "Do not return pointers to stack-allocated arrays.",
          "Avoid mixing pointer arithmetic with incorrect units (e.g., adding bytes instead of elements).",
          "Beware of off-by-one errors when iterating over indices; always double-check loop bounds.",
          "Remember to allocate space for the null terminator when working with strings.",
        ],
        code: [
          {
            caption: "Off-by-One Bug and Fix",
            content: `#include <stdio.h>

int main(void) {
    int data[5] = {1, 2, 3, 4, 5};

    // Buggy: writes past the end when i == 5
    for (size_t i = 0; i <= 5; ++i) {
        data[i] = 0; // Undefined behavior when i == 5
    }

    // Fixed loop
    for (size_t i = 0; i < 5; ++i) {
        data[i] = 0;
    }

    for (size_t i = 0; i < 5; ++i) {
        printf("%d ", data[i]);
    }
    puts("");
    return 0;
}`,
          },
        ],
      },
    ],
  },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.hero}>
          <p className={styles.kicker}>Mastering Core C Constructs</p>
          <h1>Arrays in C — Comprehensive Notes & Examples</h1>
          <p className={styles.lede}>
            A structured reference covering fundamentals, memory behavior,
            multi-dimensional arrays, pointer interplay, dynamic allocation, and
            best practices. Each topic includes concise explanations and
            runnable sample programs.
          </p>
          <nav className={styles.toc}>
            <p className={styles.tocHeading}>Quick Navigation</p>
            <ul>
              {topics.map((topic) => (
                <li key={topic.title}>
                  <a href={`#${slugify(topic.title)}`}>{topic.title}</a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <section className={styles.topics}>
          {topics.map((topic) => (
            <article
              key={topic.title}
              id={slugify(topic.title)}
              className={styles.topic}
            >
              <h2>{topic.title}</h2>
              <p className={styles.topicSummary}>{topic.summary}</p>

              <div className={styles.subtopics}>
                {topic.subtopics.map((subtopic) => (
                  <section
                    key={subtopic.title}
                    id={slugify(subtopic.title)}
                    className={styles.subtopic}
                  >
                    <h3>{subtopic.title}</h3>
                    <p>{subtopic.summary}</p>

                    {subtopic.notes && (
                      <ul className={styles.notes}>
                        {subtopic.notes.map((note) => (
                          <li key={note}>{note}</li>
                        ))}
                      </ul>
                    )}

                    {subtopic.code && (
                      <div className={styles.codeGroup}>
                        {subtopic.code.map((sample) => (
                          <figure
                            className={styles.codeSample}
                            key={`${subtopic.title}-${sample.caption}`}
                          >
                            <figcaption>{sample.caption}</figcaption>
                            <pre>
                              <code>{sample.content}</code>
                            </pre>
                          </figure>
                        ))}
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </article>
          ))}
        </section>

        <footer className={styles.footer}>
          <p>
            Need a printable copy? Export this page to PDF or integrate the code
            snippets into your favorite editor to compile and experiment.
          </p>
        </footer>
      </main>
    </div>
  );
}
